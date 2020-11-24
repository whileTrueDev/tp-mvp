import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
// import dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // **********************************************
  // Load .env file and set environment variables
  // dotenv.config();

  const app = await NestFactory.create(AppModule);

  // **********************************************
  // Set global middlewares
  // bodyparser 설정.
  app.use(json({ limit: '15mb' }));
  app.use(urlencoded({ extended: true, limit: '15mb' }));

  // helmet
  app.use(helmet());

  // cookie parser
  app.use(cookieParser('@#@$MYSIGN#@$#$')); // cookie parser 설정

  const whiteList = ['http://localhost:3001', 'http://localhost:3002'];
  app.enableCors({
    origin: whiteList,
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
