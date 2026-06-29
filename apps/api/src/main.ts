import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.setGlobalPrefix('api/v1');
  app.enableCors({
    origin: '*',
  });
  
  const port = process.env.PORT ?? 4000;
  console.log(`NestJS Backend running on port ${port}`);
  await app.listen(port);
}
bootstrap();
