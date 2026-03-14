/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { TrpcRouter } from './trpc/trpc.router';
import cookieParser from 'cookie-parser';
import * as express from 'express';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Получаем ConfigService
  const configService = app.get(ConfigService);

  // Middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // CORS - используем configService
  app.enableCors({
    origin: configService.get('frontend.url'),
    credentials: true,
    exposedHeaders: ['authorization'],
  });

  // tRPC
  const trpc = app.get(TrpcRouter);
  await trpc.applyMiddleware(app); // 👈 убираем void

  // Порт из configService
  const port = configService.get('server.port');
  const env = configService.get('env.nodeEnv');
  await app.listen(port);
  console.log(`Server is running on port ${port}`);
  console.log(`Node env: `, env);
}

void bootstrap();
