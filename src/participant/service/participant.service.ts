import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { ParticipantEntity } from '../models/participant.entity';
import { Participant } from '../models/participant.interface';

@Injectable()
export class ParticipantService {
  constructor(
    @InjectRepository(ParticipantEntity)
    private readonly participantRepository: Repository<ParticipantEntity>
  ) {}

  create(participant: Participant): Observable<Participant> {
    return from(this.participantRepository.save(participant));
  }

  deleteOne(id: number): Observable<any> {
    return from(this.participantRepository.delete(id));
  }

  updateOne(id: number, participant: Participant): Observable<any> {
    return from(this.participantRepository.update(id, participant));
  }
}
