/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { catchError, Observable, of, map } from 'rxjs';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guards';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserIsUserGuard } from 'src/auth/guards/UserIsUser.guard';
import { User } from '../models/user.interface';
import { UserRole } from '../models/user.model';
import { UserService } from '../service/user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  // eslint-disable-next-line @typescript-eslint/ban-types
  create(@Body() user: User): Observable<User | Object> {
    return this.userService.create(user).pipe(
      map((user: User) => user),
      catchError((err) => of({ error: err.message }))
    );
  }

  @Post('login')
  // eslint-disable-next-line @typescript-eslint/ban-types
  login(@Body() user: User): Observable<Object> {
    return this.userService.login(user).pipe(
      map((jwt: string) => {
        return { access_token: jwt };
      })
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, UserIsUserGuard)
  findOne(@Param() params): Observable<User> {
    return this.userService.findOne(params.id);
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Get()
  findAll(): Observable<User[]> {
    return this.userService.findAll();
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, UserIsUserGuard)
  deleteOne(@Param('id') id: string): Observable<User> {
    return this.userService.deleteOne(Number(id));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, UserIsUserGuard)
  updateOne(@Param('id') id: string, @Body() user: User): Observable<User> {
    return this.userService.updateOne(Number(id), user);
  }
}
