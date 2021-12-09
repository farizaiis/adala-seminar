/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guards';
import { ParticipantService } from 'src/participant/service/participant.service';
import { Seminar } from '../models/seminar.interface';
import { statusEnum } from '../models/seminar.model';
import { audienceEnum } from 'src/participant/models/participant.model';
import { SeminarService } from '../service/seminar.service';
import { UserIsOrganizerGuard } from 'src/auth/guards/UserIsOrganizer.guard';
import * as moment from 'moment';

@Controller('seminar')
export class SeminarController {
  constructor(
    private seminarService: SeminarService,
    private participantService: ParticipantService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body('name') name: string,
    @Body('date') date: string,
    @Body('time') time: string,
    @Body('quota') quota: number,
    @Request() req
  ) {
    try {
      const dates = new Date();
      const momentDates = moment(
        new Date(
          dates.getFullYear(),
          dates.getMonth(),
          dates.getDate(),
          dates.getHours(),
          dates.getMinutes()
        )
      );

      const today = momentDates.format('YYYY-MM-DD');
      const currentTime = momentDates.format('hh:mm:ss');

      if (date < today) {
        throw new BadRequestException(
          'You cannot create Seminar with date has already pass'
        );
      }

      if (date == today && time < currentTime) {
        throw new BadRequestException(
          'You cannot create Seminar with time has already pass'
        );
      }

      if (quota < 10 || quota > 50) {
        throw new BadRequestException(
          'Quota for seminar minimum 10 and maximum 50'
        );
      }

      const checkData = await this.seminarService.findOne({ name });

      if (checkData) {
        throw new BadRequestException('Cannot duplicate seminar');
      }

      const seminar = await this.seminarService.create({
        name,
        date,
        time,
        quota,
        status: statusEnum.comingSoon,
      });

      const organizer = await this.participantService.create({
        userId: req.user.user.id,
        seminarId: seminar.id,
        audience: audienceEnum.organizer,
      });

      return { seminar, organizer };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string, @Request() req): Promise<Seminar> {
    try {
      if (!(await this.seminarService.findOne(Number(id)))) {
        throw new NotFoundException();
      }

      const checkData = await this.participantService.findOne({
        where: { seminarId: Number(id) },
      });

      if (checkData.userId === req.user.user.id) {
        const seminar = await this.seminarService.findOne({
          where: { id },
          relations: ['listAudience', 'listAudience.user'],
        });

        delete seminar.listAudience.password;

        return seminar;
      }

      const seminar = await this.seminarService.findOne(id);

      return seminar;
    } catch (error) {
      throw error;
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async index(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 15
  ): Promise<Pagination<Seminar>> {
    try {
      limit = limit > 15 ? 15 : limit;
      const data = await this.seminarService.paginate({
        page: Number(page),
        limit: Number(limit),
        route: 'http://localhost:3000/seminar',
      });
      return data;
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, UserIsOrganizerGuard)
  async deleteOne(@Param('id') id: string): Promise<string> {
    try {
      const checkData = await this.seminarService.findOne(Number(id));

      if (!checkData) {
        throw new NotFoundException();
      }

      const deleteData = await this.seminarService.deleteOne(Number(id));

      if (!deleteData) {
        throw new InternalServerErrorException('Unable to delete data');
      }

      return 'Delete Successfully';
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, UserIsOrganizerGuard)
  async updateOne(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body('date') date: string,
    @Body('time') time: string,
    @Body('quota') quota: number,
    seminar: Seminar
  ): Promise<Seminar> {
    try {
      const checkData = await this.seminarService.findOne(Number(id));

      if (!checkData) {
        throw new NotFoundException();
      }

      if (name) {
        const checkName = await this.seminarService.findOne({ name });

        if (checkName) {
          throw new BadRequestException('Cannot duplicate seminar');
        }
      }

      if (quota) {
        if (quota < 10 || quota > 50) {
          throw new BadRequestException(
            'Quota for seminar minimum 10 and maximum 50'
          );
        }
      }

      const dates = new Date();
      const momentDates = moment(
        new Date(
          dates.getFullYear(),
          dates.getMonth(),
          dates.getDate(),
          dates.getHours(),
          dates.getMinutes()
        )
      );

      const today = momentDates.format('YYYY-MM-DD');
      const currentTime = momentDates.format('hh:mm:ss');

      if (date && time) {
        if (date < today) {
          throw new BadRequestException(
            'You cannot create Seminar with date has already pass'
          );
        }
        if (date == today && time < currentTime) {
          throw new BadRequestException(
            'You cannot create Seminar with time has already pass'
          );
        }
      }

      if (date) {
        if (date < today) {
          throw new BadRequestException(
            'You cannot create Seminar with date has already pass'
          );
        }
      }

      if (time) {
        const getDate = await this.seminarService.findOne(id);

        if (getDate == today && time < currentTime) {
          throw new BadRequestException(
            'You cannot create Seminar with time has already pass'
          );
        }
      }

      const updateData = await this.seminarService.updateOne(
        Number(id),
        seminar
      );

      if (!updateData) {
        throw new InternalServerErrorException('Unable to update data');
      }

      const getData = await this.seminarService.findOne(Number(id));

      return getData;
    } catch (error) {
      throw error;
    }
  }
}
