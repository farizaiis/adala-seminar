/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ParticipantService } from './service/participant.service';
import { ParticipantController } from './controller/participant.controller';
import { ParticipantEntity } from './models/participant.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { SeminarModule } from 'src/seminar/seminar.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ParticipantEntity]),
    AuthModule,
    UserModule,
    SeminarModule,
  ],
  providers: [ParticipantService],
  controllers: [ParticipantController],
})
export class ParticipantModule {}
