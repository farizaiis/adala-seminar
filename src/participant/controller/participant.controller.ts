import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { catchError, map, Observable, of } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guards';
import { Participant } from '../models/participant.interface';
import { ParticipantService } from '../service/participant.service';

@Controller('participant')
export class ParticipantController {
  constructor(private participantService: ParticipantService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  // eslint-disable-next-line @typescript-eslint/ban-types
  create(@Body() participant: Participant): Observable<Participant | Object> {
    return this.participantService.create(participant).pipe(
      map((participant: Participant) => participant),
      catchError((err) => of({ error: err.message }))
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  deleteOne(@Param('id') id: string): Observable<Participant> {
    return this.participantService.deleteOne(Number(id));
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  updateOne(
    @Param('id') id: string,
    @Body() participant: Participant
  ): Observable<Participant> {
    return this.participantService.updateOne(Number(id), participant);
  }
}
