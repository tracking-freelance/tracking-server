import { Controller, Get, Param, Query } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { ListDto } from 'src/shared/dto/list.dto';
import { RecordsService } from 'src/records/records.service';

@Controller('sessions')
export class SessionsController {
  constructor(
    private readonly sessionsService: SessionsService,
    private readonly recordsService: RecordsService,
  ) {}

  @Get(':id/records')
  list(@Param('id') id: string, @Query() query: ListDto) {
    return this.recordsService.listBySessionId(id, query);
  }
}
