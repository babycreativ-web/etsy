import { Controller, Get, Param, Query } from '@nestjs/common';
import { ShopsService } from './shops.service';

@Controller('shops')
export class ShopsController {
  constructor(private readonly shopsService: ShopsService) {}

  @Get(':name')
  async getShopProfile(@Param('name') name: string) {
    return this.shopsService.findByName(name);
  }

  @Get(':id/top-products')
  async getTopProducts(
    @Param('id') shopId: string,
    @Query('limit') limit?: string,
  ) {
    const limitVal = limit ? parseInt(limit, 10) : 10;
    return this.shopsService.getTopProducts(shopId, limitVal);
  }

  @Get(':id/categories')
  async getShopCategories(@Param('id') shopId: string) {
    return this.shopsService.getShopCategories(shopId);
  }

  @Get(':id/keywords')
  async getShopKeywords(@Param('id') shopId: string) {
    return this.shopsService.getShopKeywords(shopId);
  }

  @Get(':id/timeline')
  async getShopTimeline(@Param('id') shopId: string) {
    return this.shopsService.getShopTimeline(shopId);
  }
}
