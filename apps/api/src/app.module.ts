import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ShopsModule } from './shops/shops.module';
import { ListingsModule } from './listings/listings.module';
import { KeywordsModule } from './keywords/keywords.module';

@Module({
  imports: [PrismaModule, ShopsModule, ListingsModule, KeywordsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
