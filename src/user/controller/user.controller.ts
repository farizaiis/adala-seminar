/* eslint-disable prettier/prettier */
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guards';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserIsUserGuard } from 'src/auth/guards/UserIsUser.guard';
import { User } from '../models/user.interface';
import { UserRole } from '../models/user.model';
import { UserService } from '../service/user.service';
import * as bcrypt from 'bcrypt';
import { AuthService } from 'src/auth/service/auth.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private authService: AuthService
  ) {}

  @Post('register')
  async register(
    @Body('fullName') fullName: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('role') role: string
  ) {
    try {
      if (fullName === undefined) {
        throw new BadRequestException('Fullname Required ');
      }

      if (email === undefined) {
        throw new BadRequestException('Email Required');
      }

      if (password === undefined) {
        throw new BadRequestException('Password Required');
      }

      const checkEmail = await this.userService.findOne({ email });
      if (checkEmail) {
        throw new BadRequestException(
          'Email already use, please use another email'
        );
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const users = await this.userService.create({
        fullName,
        email,
        password: hashedPassword,
        // role: UserRole.USER,
        role,
      });

      const token = await this.authService.generateJWT(users);

      delete users.password;
      delete users.role;

      return { users, token };
    } catch (error) {
      throw error;
    }
  }

  @Post('login')
  async login(
    @Body('email') email: string,
    @Body('password') password: string
  ) {
    try {
      if (email === undefined || password === undefined) {
        throw new BadRequestException('Email & Password Required');
      }

      const user = await this.userService.findOne({ email });

      if (!user) {
        throw new BadRequestException('Invalid Email');
      }

      if (!(await this.authService.comparePasswords(password, user.password))) {
        throw new BadRequestException('Invalid Password');
      }

      const token = await this.authService.generateJWT(user);

      return { token };
    } catch (error) {
      throw error;
    }
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, UserIsUserGuard)
  async findOne(@Param('id') id: string): Promise<User> {
    try {
      const user = await this.userService.findOne({
        where: { id },
        relations: ['registeredSeminar', 'registeredSeminar.seminar'],
      });

      delete user.password;
      delete user.role;

      return user;
    } catch (error) {
      throw error;
    }
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  async findAll(): Promise<User[]> {
    try {
      const users = await this.userService.findAll();

      users.forEach(function (v) {
        delete v.password;
        delete v.role;
      });

      return users;
    } catch (error) {
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, UserIsUserGuard)
  async deleteOne(@Param('id') id: string): Promise<string> {
    try {
      const deleteUser = await this.userService.deleteOne(Number(id));

      if (!deleteUser) {
        throw new InternalServerErrorException('Unable to delete data');
      }

      return 'Delete Successfully';
    } catch (error) {
      throw error;
    }
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, UserIsUserGuard)
  async updateOne(@Param('id') id: string, @Body() user: User): Promise<User> {
    try {
      const updateData = await this.userService.updateOne(Number(id), user);

      if (!updateData) {
        throw new InternalServerErrorException('Unable to update data');
      }

      const getData = await this.userService.findOne(Number(id));

      delete getData.password;
      delete getData.role;

      return getData;
    } catch (error) {
      throw error;
    }
  }
}
