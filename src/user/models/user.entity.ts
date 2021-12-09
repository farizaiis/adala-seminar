/* eslint-disable prettier/prettier */
import { Exclude } from 'class-transformer';
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
  
  @Column({select: false})
  password: string;

  @Exclude({ toPlainOnly: true })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
    select: false
  })
  role: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Exclude({ toPlainOnly: true })
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
  registeredSeminar: ParticipantEntity[];
}
