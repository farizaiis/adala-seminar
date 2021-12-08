/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  NotFoundException,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guards';
import { SeminarService } from 'src/seminar/service/seminar.service';
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

    if (seminar.status === 'Ended') {
      throw new BadRequestException('Seminar has Ended');
    }

    const participant = await this.participantService.create({
      seminarId,
      userId: req.user.user.id,
      audience: audienceEnum.participant,
    });

    return { seminar, participant };
  }
}
