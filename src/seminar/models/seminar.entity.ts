/* eslint-disable prettier/prettier */
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
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
}
