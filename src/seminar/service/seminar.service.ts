/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { SeminarEntity } from '../models/seminar.entity';
import { Seminar } from '../models/seminar.interface';

@Injectable()
export class SeminarService {
  constructor(
    @InjectRepository(SeminarEntity)
    private readonly seminarRepository: Repository<SeminarEntity>
  ) {}

  create(seminar: Seminar): Observable<Seminar> {
    return from(this.seminarRepository.save(seminar));
  }

  findOne(id: number): Observable<Seminar> {
    return from(this.seminarRepository.findOne({ id }));
  }

  findAll(): Observable<Seminar[]> {
    return from(this.seminarRepository.find());
  }

  deleteOne(id: number): Observable<any> {
    return from(this.seminarRepository.delete(id));
  }

  updateOne(id: number, seminar: Seminar): Observable<any> {
    return from(this.seminarRepository.update(id, seminar));
  }
}
