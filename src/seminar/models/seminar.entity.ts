/* eslint-disable prettier/prettier */
import { ParticipantEntity } from 'src/participant/models/participant.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  BeforeUpdate,
} from 'typeorm';
import { statusEnum } from './seminar.model';

@Entity()
export class SeminarEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'date' })
  date: string;

  @Column({ type: 'time without time zone' })
  time: string;

  @Column()
  quota: number;

  @Column({
    type: 'enum',
    enum: statusEnum,
    default: statusEnum.comingSoon,
  })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeUpdate()
  updateTimeStamo() {
    this.updatedAt = new Date();
  }

  @OneToMany(
    () => ParticipantEntity,
    (participantEntity) => participantEntity.seminar
  )
  listAudience: ParticipantEntity[];
}
