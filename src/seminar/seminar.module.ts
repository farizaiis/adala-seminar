/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { SeminarService } from './service/seminar.service';
import { SeminarController } from './controller/seminar.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeminarEntity } from './models/seminar.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SeminarEntity])],
  providers: [SeminarService],
  controllers: [SeminarController],
})
export class SeminarModule {}
