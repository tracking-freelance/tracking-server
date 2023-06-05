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

  @Post('end')
  async endSession(@Req() req: Request) {
    const sessionId = req.cookies['session_id'];
    await this.sessionsService.end(sessionId);
  }

  @Post()
  async create(
    @Body() createTrackingDto: CreateTrackingDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      let userId = req.cookies['user_id'];

      if (!userId || !(await this.usersService.isUserExists(userId))) {
        userId = await this.usersService.create().then((u) => u.id);
      }

      let sessionId = req.cookies['session_id'];
      if (
        !sessionId ||
        !(await this.sessionsService.isSessionExists(sessionId))
      ) {
        sessionId = await this.sessionsService
          .create({ userId: parseInt(userId) })
          .then((s) => s.id);
      } else {
        const session = await this.sessionsService.findOne(sessionId);
        if (session.endDate !== null) {
          sessionId = await this.sessionsService
            .create({ userId: parseInt(userId) })
            .then((s) => s.id);
        }
      }

      createTrackingDto.sessionId = parseInt(sessionId);

      await this.trackingsService.create(createTrackingDto);

      res
        .cookie('user_id', userId, {
          maxAge: 99999999999,
          httpOnly: true,
          secure: this.nodeEnv === 'production',
          sameSite: 'none',
        })
        .cookie('session_id', sessionId, {
          maxAge: 99999999999,
          httpOnly: true,
          secure: this.nodeEnv === 'production',
          sameSite: 'none',
        })
        .status(HttpStatus.NO_CONTENT)
        .json();
    } catch (error) {
      this.logger.error(error);
      res
        .clearCookie('user_id')
        .clearCookie('session_id')
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json();
    }
  }
}
