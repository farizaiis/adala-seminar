import { Module } from '@nestjs/common';
import { ParticipantService } from './service/participant.service';
import { ParticipantController } from './controller/participant.controller';
import { ParticipantEntity } from './models/participant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ParticipantEntity])],
  providers: [ParticipantService],
  controllers: [ParticipantController],
})
export class ParticipantModule {}
