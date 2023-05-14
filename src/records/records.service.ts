import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListDto } from 'src/shared/dto/list.dto';

@Injectable()
export class RecordsService {
  constructor(private readonly prisma: PrismaService) {}

  async listBySessionId(sessionId: string, input: ListDto) {
    const count = await this.prisma.record.count({
      where: { sessionId: Number(sessionId) },
    });

    const data = await this.prisma.record.findMany({
      where: { sessionId: Number(sessionId) },
      skip: Number(input.offset),
      take: Number(input.limit),
      orderBy: { id: 'asc' },
    });

    return {
      count,
      data,
    };
  }
}
