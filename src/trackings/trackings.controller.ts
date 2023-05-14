import {
  Body,
  Controller,
  HttpStatus,
  Logger,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { CreateTrackingDto } from './dto/create-tracking.dto';
import { TrackingsService } from './trackings.service';
import { Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { SessionsService } from 'src/sessions/sessions.service';
import { ConfigService } from '@nestjs/config';

@Controller('trackings')
export class TrackingsController {
  private logger = new Logger(TrackingsController.name);

  private nodeEnv: string;

  constructor(
    private readonly trackingsService: TrackingsService,
    private readonly usersService: UsersService,
    private readonly sessionsService: SessionsService,
    private readonly configService: ConfigService,
  ) {
    this.nodeEnv = this.configService.get<string>('NODE_ENV');
  }

  @Post()
  async create(
    @Body() createTrackingDto: CreateTrackingDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    let userId = req.cookies['user_id'];
    if (!userId) {
      userId = await this.usersService.create().then((u) => u.id);
    }

    let sessionId = req.cookies['session_id'];
    if (!sessionId) {
      sessionId = await this.sessionsService
        .create({ userId: parseInt(userId) })
        .then((s) => s.id);
    }

    createTrackingDto.sessionId = parseInt(sessionId);

    await this.trackingsService.create(createTrackingDto);

    res
      .cookie('user_id', userId, {
        maxAge: 99999999999,
        httpOnly: true,
        secure: this.nodeEnv === 'production',
      })
      .cookie('session_id', sessionId, {
        maxAge: 99999999999,
        httpOnly: true,
        secure: this.nodeEnv === 'production',
      })
      .status(HttpStatus.NO_CONTENT)
      .json();
  }
}
