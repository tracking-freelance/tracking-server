import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateSessionDto } from './dto/CreateSession.dto';
import dayjs from 'dayjs';
import { ListDto } from 'src/shared/dto/list.dto';

BigInt.prototype.toJSON = function () {
  return Number(this);
};

@Injectable()
export class SessionsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(id: string) {
    return this.prisma.session.findUnique({
      where: { id: Number(id) },
    });
  }

  async end(id: string) {
    const now = dayjs().format('YYYY-MM-DD');
    const endTime = BigInt(new Date().getTime());

    return this.prisma.session.update({
      where: { id: Number(id) },
      data: {
        endDate: now,
        endTime,
      },
    });
  }

  async list(id: string, input: ListDto) {
    const count = await this.prisma.record.count({
      where: { sessionId: Number(id) },
    });

    const data = await this.prisma.record.findMany({
      where: { sessionId: Number(id) },
      skip: Number(input.offset),
      take: Number(input.limit),
      orderBy: { id: 'asc' },
    });

    return {
      count,
      data,
    };
  }

  async listByUserId(userId: string, input: ListDto) {
    const count = await this.prisma.session.count({
      where: { userId: Number(userId) },
    });

    const data = await this.prisma.session.findMany({
      where: { userId: Number(userId) },
      skip: Number(input.offset),
      take: Number(input.limit),
      orderBy: { id: 'asc' },
    });

    return {
      count,
      data,
    };
  }

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
