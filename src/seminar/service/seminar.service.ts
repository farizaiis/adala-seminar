/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { SeminarEntity } from '../models/seminar.entity';
import { Seminar } from '../models/seminar.interface';
import {
  paginate,
  Pagination,
  IPaginationOptions,
} from 'nestjs-typeorm-paginate';

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

  paginate(options: IPaginationOptions): Observable<Pagination<Seminar>> {
    return from(paginate<Seminar>(this.seminarRepository, options)).pipe(
      map((seminarPageable: Pagination<Seminar>) => {
        return seminarPageable;
      })
    );
  }

  deleteOne(id: number): Observable<any> {
    return from(this.seminarRepository.delete(id));
  }

  updateOne(id: number, seminar: Seminar): Observable<any> {
    return from(this.seminarRepository.update(id, seminar));
  }
}
