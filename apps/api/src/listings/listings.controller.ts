import { Controller, Get, Param, Query } from '@nestjs/common';
import { ListingsService } from './listings.service';

@Controller('listings')
export class ListingsController {
  constructor(private readonly listingsService: ListingsService) {}

  @Get()
  async getListings(
    @Query('category') categoryName?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('minSales') minSales?: string,
    @Query('maxSales') maxSales?: string,
    @Query('minRevenue') minRevenue?: string,
    @Query('maxRevenue') maxRevenue?: string,
    @Query('isDigital') isDigital?: string,
    @Query('isPhysical') isPhysical?: string,
    @Query('hasFreeShipping') hasFreeShipping?: string,
    @Query('processingTimeMax') processingTimeMax?: string,
    @Query('keyword') keyword?: string,
    @Query('tag') tag?: string,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.listingsService.findAll({
      categoryName,
      minPrice: minPrice ? parseFloat(minPrice) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
      minSales: minSales ? parseInt(minSales, 10) : undefined,
      maxSales: maxSales ? parseInt(maxSales, 10) : undefined,
      minRevenue: minRevenue ? parseFloat(minRevenue) : undefined,
      maxRevenue: maxRevenue ? parseFloat(maxRevenue) : undefined,
      isDigital: isDigital === 'true' ? true : isDigital === 'false' ? false : undefined,
      isPhysical: isPhysical === 'true' ? true : isPhysical === 'false' ? false : undefined,
      hasFreeShipping: hasFreeShipping === 'true' ? true : hasFreeShipping === 'false' ? false : undefined,
      processingTimeMax: processingTimeMax ? parseInt(processingTimeMax, 10) : undefined,
      keyword,
      tag,
      limit: limit ? parseInt(limit, 10) : undefined,
      offset: offset ? parseInt(offset, 10) : undefined,
    });
  }

  @Get(':id')
  async getListingDetails(@Param('id') id: string) {
    return this.listingsService.findOne(id);
  }
}
