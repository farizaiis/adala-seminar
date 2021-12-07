/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guards';
import { SeminarService } from 'src/seminar/service/seminar.service';
import { Participant } from '../models/participant.interface';
import { audienceEnum } from '../models/participant.model';
import { ParticipantService } from '../service/participant.service';

@Controller('participant')
export class ParticipantController {
  constructor(
    private participantService: ParticipantService,
    private seminarService: SeminarService
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  // eslint-disable-next-line @typescript-eslint/ban-types
  async create(@Body('seminarId') seminarId: number, @Request() req) {
    const seminar = await this.seminarService.findOne({ id: seminarId });

    if (!seminar) {
      throw new NotFoundException();
    }

    const checkQuota = await this.seminarService.countAudience({ seminarId });

    if (seminar.quota <= checkQuota) {
      throw new BadRequestException(
        'You cannot join the seminar, because the audience already full'
      );
    }

    const participant = await this.participantService.create({
      seminarId,
      userId: req.user.user.id,
      audience: audienceEnum.participant,
    });

    return { seminar, participant };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteOne(@Param('id') id: string): Promise<Participant> {
    return this.participantService.deleteOne(Number(id));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateOne(
    @Param('id') id: string,
    @Body() participant: Participant
  ): Promise<Participant> {
    return this.participantService.updateOne(Number(id), participant);
  }
}
