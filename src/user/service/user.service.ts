/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../models/user.entity';
import { User } from '../models/user.interface';
import { AuthService } from 'src/auth/service/auth.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private authService: AuthService
  ) {}

  async create(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async findOne(condition: any): Promise<User> {
    return this.userRepository.findOne(condition);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async deleteOne(id: number): Promise<any> {
    return this.userRepository.delete(id);
  }

  async updateOne(id: number, user: User): Promise<any> {
    delete user.email;
    delete user.password;
    delete user.role;

    return this.userRepository.update(id, user);
  }
}
