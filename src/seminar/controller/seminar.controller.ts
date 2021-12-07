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
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<Seminar> {
    if (!(await this.seminarService.findOne(Number(id)))) {
      throw new NotFoundException();
    }

    const seminar = await this.seminarService.findOne({
      where: { id },
      relations: ['listAudience', 'listAudience.user'],
    });

    return seminar;
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async index(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 15
  ): Promise<Pagination<Seminar>> {
    limit = limit > 15 ? 15 : limit;
    const data = await this.seminarService.paginate({
      page: Number(page),
      limit: Number(limit),
      route: 'http://localhost:3000/seminar',
    });
    return data;
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, UserIsOrganizerGuard)
  async deleteOne(@Param('id') id: string): Promise<string> {
    const checkData = await this.seminarService.findOne(Number(id));

    if (!checkData) {
      throw new NotFoundException();
    }

    const deleteData = await this.seminarService.deleteOne(Number(id));

    if (!deleteData) {
      throw new InternalServerErrorException('Unable to delete data');
    }

    return 'Delete Successfully';
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, UserIsOrganizerGuard)
  async updateOne(
    @Param('id') id: string,
    @Body('name') name: string,
    @Body()
    seminar: Seminar
  ): Promise<Seminar> {
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

    const updateData = await this.seminarService.updateOne(Number(id), seminar);

    if (!updateData) {
      throw new InternalServerErrorException('Unable to update data');
    }

    const getData = await this.seminarService.findOne(Number(id));

    return getData;
  }
}
