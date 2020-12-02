import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
// import dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  // **********************************************
  // Load .env file and set environment variables
  // dotenv.config();

  const app = await NestFactory.create(AppModule, {});

  // **********************************************
  // Set global middlewares
  // bodyparser는 이미 활성화되어있다.

  // helmet
  app.use(helmet());

  // Set morgan Logger
  app.use(morgan('common'));

  // cookie parser
  app.use(cookieParser('@#@$MYSIGN#@$#$')); // cookie parser 설정

  const whiteList = [
    'http://localhost:3001', 'http://localhost:3002',
    'https://mytruepoint.com', 'https://admin.mytruepoint.com',
    'https://dev.mytruepoint.com', 'https://test.mytruepoint.com',
  ];
  app.enableCors({
    origin: whiteList,
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
