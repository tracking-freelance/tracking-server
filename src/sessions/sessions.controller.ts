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

  @Post(':id/end')
  async endSession(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.sessionsService.end(id);
    const sessionId = await this.sessionsService
      .create({ userId: parseInt(req.cookies['user_id']) })
      .then((s) => s.id);

    res
      .cookie('session_id', sessionId, {
        maxAge: 99999999999,
        httpOnly: true,
      })
      .status(HttpStatus.NO_CONTENT)
      .json();
  }
}
