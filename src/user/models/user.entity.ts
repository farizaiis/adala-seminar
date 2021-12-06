/* eslint-disable prettier/prettier */
import { ParticipantEntity } from 'src/participant/models/participant.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BeforeInsert,
  OneToMany,
  BeforeUpdate,
} from 'typeorm';
import { UserRole } from './user.model';

@Entity()
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
  })
  role: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @BeforeInsert()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
  }

  @BeforeUpdate()
  updateTimeStamo() {
    this.updatedAt = new Date();
  }

  @OneToMany(
    () => ParticipantEntity,
    (participantEntity) => participantEntity.user
  )
  public participantEntity: ParticipantEntity;
}
