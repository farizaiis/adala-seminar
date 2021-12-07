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

  async findOne(condition: any): Promise<Seminar> {
    return this.seminarRepository.findOne(condition);
  }

  async findAll(): Promise<Seminar[]> {
    return this.seminarRepository.find();
  }

  async paginate(options: IPaginationOptions): Promise<Pagination<Seminar>> {
    return paginate<Seminar>(this.seminarRepository, options)
  }

  async deleteOne(id: number): Promise<any> {
    return this.seminarRepository.delete(id);
  }

  async updateOne(id: number, seminar: Seminar): Promise<any> {
    return this.seminarRepository.update(id, seminar);
  }
}
