import { Injectable } from '@nestjs/common';
import { CreateTrackingDto } from './dto/create-tracking.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TrackingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ sessionId, ...createTrackingDto }: CreateTrackingDto) {
    const record = await this.prisma.record.create({
      data: {
        ...createTrackingDto,
        timestamp: createTrackingDto.timestamp,
        session: {
          connect: { id: sessionId },
        },
      },
    });

    return record;
  }
}
