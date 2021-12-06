/* eslint-disable prettier/prettier */
import { SeminarEntity } from 'src/seminar/models/seminar.entity';
import { UserEntity } from 'src/user/models/user.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class ParticipantEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  seminarId: number;

  @ManyToOne(() => SeminarEntity, (seminar) => seminar.participantEntity)
  public seminar: SeminarEntity;

  @ManyToOne(() => UserEntity, (user) => user.participantEntity)
  public user: UserEntity;
}
