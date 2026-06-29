import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ShopsService {
  constructor(private readonly prisma: PrismaService) {}

  async findByName(name: string) {
    const shop = await this.prisma.client.shop.findUnique({
      where: { name },
      include: {
        snapshots: {
          orderBy: { date: 'asc' },
          take: 30, // Retrieve last 30 snapshots
        },
      },
    });

    if (!shop) {
      throw new NotFoundException(`Shop with name '${name}' not found.`);
    }

    return shop;
  }

  async getTopProducts(shopId: string, limit = 10) {
    return this.prisma.client.listing.findMany({
      where: { shopId },
      orderBy: { salesCount: 'desc' },
      take: limit,
    });
  }

  async getShopCategories(shopId: string) {
    const shopCategories = await this.prisma.client.shopCategory.findMany({
      where: { shopId },
      include: { category: true },
    });
    return shopCategories.map((sc) => sc.category);
  }

  async getShopKeywords(shopId: string) {
    // Collect primary keywords (tags) from shop listings
    const listings = await this.prisma.client.listing.findMany({
      where: { shopId },
      select: { tags: true },
    });

    const keywordCounts: Record<string, number> = {};
    for (const listing of listings) {
      if (listing.tags) {
        for (const tag of listing.tags) {
          keywordCounts[tag] = (keywordCounts[tag] || 0) + 1;
        }
      }
    }

    // Sort tags by frequency
    return Object.entries(keywordCounts)
      .map(([phrase, count]) => ({ phrase, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 15);
  }

  async getShopTimeline(shopId: string) {
    return this.prisma.client.shopSnapshot.findMany({
      where: { shopId },
      orderBy: { date: 'asc' },
    });
  }
}
