import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { LogInterceptor } from './interceptors/log.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  //Log para todas as execuções;
  app.useGlobalInterceptors(new LogInterceptor());
  app.enableShutdownHooks();
  await app.listen(3001);
}
bootstrap();
