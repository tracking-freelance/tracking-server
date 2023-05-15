import { Injectable } from '@nestjs/common';
import { CreateTrackingDto } from './dto/create-tracking.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TrackingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create({ sessionId, ...createTrackingDto }: CreateTrackingDto) {
    const records = await Promise.all(
      createTrackingDto.events.map((e) => {
        return this.prisma.record.create({
          data: {
            ...(e as any),
            timestamp: (e as any).timestamp,
            session: {
              connect: { id: sessionId },
            },
          },
        });
      }),
    );

    return records;
  }
}
