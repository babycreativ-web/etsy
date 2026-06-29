import { Controller, Get, Query, Param } from '@nestjs/common';
import { KeywordsService } from './keywords.service';

@Controller('keywords')
export class KeywordsController {
  constructor(private readonly keywordsService: KeywordsService) {}

  @Get('search')
  async searchKeywords(
    @Query('q') query: string,
    @Query('limit') limit?: string,
  ) {
    const queryVal = query || '';
    const limitVal = limit ? parseInt(limit, 10) : 50;
    return this.keywordsService.search(queryVal, limitVal);
  }

  @Get(':phrase')
  async getKeywordDetails(@Param('phrase') phrase: string) {
    return this.keywordsService.findOne(phrase);
  }
}
