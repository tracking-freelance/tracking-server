import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { ListDto } from 'src/shared/dto/list.dto';
import { RecordsService } from 'src/records/records.service';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('sessions')
export class SessionsController {
  nodeEnv: string;

  constructor(
    private readonly sessionsService: SessionsService,
    private readonly recordsService: RecordsService,
    private readonly configService: ConfigService,
  ) {
    this.nodeEnv = this.configService.get<string>('NODE_ENV');
  }

  @Get(':id/records')
  list(@Param('id') id: string, @Query() query: ListDto) {
    return this.recordsService.listBySessionId(id, query);
  }
}
