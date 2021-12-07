/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SeminarService } from './service/seminar.service';
import { SeminarController } from './controller/seminar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeminarEntity } from './models/seminar.entity';
import { ParticipantService } from 'src/participant/service/participant.service';
import { ParticipantEntity } from 'src/participant/models/participant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SeminarEntity, ParticipantEntity])],
  providers: [SeminarService, ParticipantService],
  controllers: [SeminarController],
})
export class SeminarModule {}
