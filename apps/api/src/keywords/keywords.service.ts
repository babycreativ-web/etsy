import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class KeywordsService {
  constructor(private readonly prisma: PrismaService) {}

  async search(query: string, limit = 50) {
    return this.prisma.client.keyword.findMany({
      where: {
        phrase: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: limit,
      orderBy: { searchVolume: 'desc' },
    });
  }

  async findOne(phrase: string) {
    const keyword = await this.prisma.client.keyword.findUnique({
      where: { phrase },
      include: {
        snapshots: {
          orderBy: { date: 'asc' },
          take: 12,
        },
      },
    });

    if (!keyword) {
      throw new NotFoundException(`Keyword '${phrase}' not found.`);
    }

    return keyword;
  }
}
