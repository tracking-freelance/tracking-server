import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListDto } from 'src/shared/dto/list.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async isUserExists(userId: number) {
    const user = await this.prisma.user.findFirst({ where: { id: userId } });
    return !!user;
  }

  create() {
    return this.prisma.user.create({ data: {} });
  }

  async list(input: ListDto) {
    const total = await this.prisma.user.count();
    const data = await this.prisma.user.findMany({
      skip: Number(input.offset),
      take: Number(input.limit),
      orderBy: { id: 'asc' },
    });
    return { total, data };
  }
}
