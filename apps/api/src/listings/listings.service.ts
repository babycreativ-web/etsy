import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@etsy/database';

@Injectable()
export class ListingsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: {
    categoryName?: string;
    minPrice?: number;
    maxPrice?: number;
    minSales?: number;
    maxSales?: number;
    minRevenue?: number;
    maxRevenue?: number;
    isDigital?: boolean;
    isPhysical?: boolean;
    hasFreeShipping?: boolean;
    processingTimeMax?: number;
    keyword?: string;
    tag?: string;
    limit?: number;
    offset?: number;
  }) {
    const where: Prisma.ListingWhereInput = {};

    if (filters.categoryName) {
      where.categories = {
        some: {
          category: {
            name: {
              equals: filters.categoryName,
              mode: 'insensitive',
            },
          },
        },
      };
    }

    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      where.price = {};
      if (filters.minPrice !== undefined) where.price.gte = filters.minPrice;
      if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice;
    }

    if (filters.minSales !== undefined || filters.maxSales !== undefined) {
      where.salesCount = {};
      if (filters.minSales !== undefined) where.salesCount.gte = filters.minSales;
      if (filters.maxSales !== undefined) where.salesCount.lte = filters.maxSales;
    }

    if (filters.minRevenue !== undefined || filters.maxRevenue !== undefined) {
      where.estimatedRevenue = {};
      if (filters.minRevenue !== undefined) where.estimatedRevenue.gte = filters.minRevenue;
      if (filters.maxRevenue !== undefined) where.estimatedRevenue.lte = filters.maxRevenue;
    }

    if (filters.isDigital !== undefined) {
      where.isDigital = filters.isDigital;
    }
    if (filters.isPhysical !== undefined) {
      where.isPhysical = filters.isPhysical;
    }
    if (filters.hasFreeShipping !== undefined) {
      where.hasFreeShipping = filters.hasFreeShipping;
    }

    if (filters.processingTimeMax !== undefined) {
      where.processingTimeMax = { lte: filters.processingTimeMax };
    }

    if (filters.tag) {
      where.tags = { has: filters.tag };
    }

    if (filters.keyword) {
      where.OR = [
        { title: { contains: filters.keyword, mode: 'insensitive' } },
        { description: { contains: filters.keyword, mode: 'insensitive' } },
        { tags: { has: filters.keyword } },
      ];
    }

    const limit = filters.limit || 50;
    const offset = filters.offset || 0;

    const [items, total] = await Promise.all([
      this.prisma.client.listing.findMany({
        where,
        take: limit,
        skip: offset,
        orderBy: { salesCount: 'desc' },
        include: {
          shop: {
            select: { name: true, logoUrl: true },
          },
        },
      }),
      this.prisma.client.listing.count({ where }),
    ]);

    return {
      items,
      total,
      limit,
      offset,
    };
  }

  async findOne(id: string) {
    const listing = await this.prisma.client.listing.findUnique({
      where: { id },
      include: {
        snapshots: {
          orderBy: { date: 'asc' },
          take: 30,
        },
        shop: true,
      },
    });

    if (!listing) {
      throw new NotFoundException(`Listing with ID '${id}' not found.`);
    }

    return listing;
  }
}
