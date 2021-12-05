/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable prettier/prettier */
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { catchError, Observable, of, map } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guards';
import { Seminar } from '../models/seminar.interface';
import { SeminarService } from '../service/seminar.service';

@Controller('seminar')
export class SeminarController {
  constructor(private seminarService: SeminarService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  // eslint-disable-next-line @typescript-eslint/ban-types
  create(@Body() seminar: Seminar): Observable<Seminar | Object> {
    return this.seminarService.create(seminar).pipe(
      map((seminar: Seminar) => seminar),
      catchError((err) => of({ error: err.message }))
    );
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param() params): Observable<Seminar> {
    return this.seminarService.findOne(params.id);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  index(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 15
  ): Observable<Pagination<Seminar>> {
    limit = limit > 15 ? 15 : limit;
    return this.seminarService.paginate({
      page: Number(page),
      limit: Number(limit),
      route: 'http://localhost:3000/seminar',
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteOne(@Param('id') id: string): Observable<Seminar> {
    return this.seminarService.deleteOne(Number(id));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateOne(
    @Param('id') id: string,
    @Body() seminar: Seminar
  ): Observable<Seminar> {
    return this.seminarService.updateOne(Number(id), seminar);
  }
}
