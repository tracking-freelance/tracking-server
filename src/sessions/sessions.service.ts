import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSessionDto } from './dto/CreateSession.dto';
import dayjs from 'dayjs';

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateSessionDto) {
    const now = dayjs().format('YYYY-MM-DD');
    dto.startDate = now;
    dto.startTime = BigInt(new Date().getTime());

    return this.prisma.session.create({
      data: {
        ...dto,
      },
    });
  }
}
