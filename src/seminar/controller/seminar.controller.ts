/* eslint-disable prettier/prettier */
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
  } from '@nestjs/common';
  import { catchError, Observable, of, map } from 'rxjs';
  import { Seminar } from '../models/seminar.interface';
  import { SeminarService } from '../service/seminar.service';

@Controller('seminar')
export class SeminarController {
    constructor(private seminarService: SeminarService) {}

  @Post()
  // eslint-disable-next-line @typescript-eslint/ban-types
  create(@Body() seminar: Seminar): Observable<Seminar | Object> {
    return this.seminarService.create(seminar).pipe(
      map((seminar: Seminar) => seminar),
      catchError((err) => of({ error: err.message }))
    );
  }

  @Get(':id')
  findOne(@Param() params): Observable<Seminar> {
    return this.seminarService.findOne(params.id);
  }

  @Get()
  findAll(): Observable<Seminar[]> {
    return this.seminarService.findAll();
  }

  @Delete(':id')
  deleteOne(@Param('id') id: string): Observable<Seminar> {
    return this.seminarService.deleteOne(Number(id));
  }

  @Put(':id')
  updateOne(@Param('id') id: string, @Body() seminar: Seminar): Observable<Seminar> {
    return this.seminarService.updateOne(Number(id), seminar);
  }
}
