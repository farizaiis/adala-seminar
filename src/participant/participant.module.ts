/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ParticipantService } from './service/participant.service';
import { ParticipantController } from './controller/participant.controller';
import { ParticipantEntity } from './models/participant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeminarEntity } from 'src/seminar/models/seminar.entity';
import { SeminarService } from 'src/seminar/service/seminar.service';

@Module({
  imports: [TypeOrmModule.forFeature([ParticipantEntity, SeminarEntity])],
  providers: [ParticipantService, SeminarService],
  controllers: [ParticipantController],
})
export class ParticipantModule {}
