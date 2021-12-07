/* eslint-disable prettier/prettier */
import { SeminarEntity } from 'src/seminar/models/seminar.entity';
import { UserEntity } from 'src/user/models/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { audienceEnum } from './participant.model';

@Entity()
export class ParticipantEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  seminarId: number;

  @Column({
    type: 'enum',
    enum: audienceEnum,
    default: audienceEnum.participant,
  })
  audience: string;

  @ManyToOne(() => SeminarEntity, (seminar) => seminar.participantEntity)
  public seminar: SeminarEntity;

  @ManyToOne(() => UserEntity, (user) => user.participantEntity)
  public user: UserEntity;
}
