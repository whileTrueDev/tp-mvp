import helmet from 'helmet';
// import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
// import dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import colorizedMorgan from './middleware/colorizedMorgan';

async function bootstrap() {
  // **********************************************
  // Load .env file and set environment variables
  // dotenv.config();

  const app = await NestFactory.create(AppModule, {});

  // **********************************************
  // Set global middlewares
  // bodyparser 설정.
  app.use(json({ limit: '15mb' }));
  app.use(urlencoded({ extended: true, limit: '15mb' }));

  // helmet
  // app.use(helmet());
  // adminbro admin page inlinescript 사용위한 설정
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        styleSrc: ["'self'", 'https:', "'unsafe-inline'"],
        baseUri: ["'self'"],
        fontSrc: ["'self'", 'https:', 'data:'],
      },
    },
  }));

  // Set morgan Logger
  app.use(colorizedMorgan);

  // cookie parser
  app.use(cookieParser('@#@$MYSIGN#@$#$')); // cookie parser 설정

  const whiteList = [
    'http://localhost:3001', 'http://localhost:3002',
    'https://mytruepoint.com',
    'https://admin.mytruepoint.com', 'https://test-admin.mytruepoint.com',
    'https://dev.mytruepoint.com', 'https://test.mytruepoint.com',
  ];

  app.enableCors({
    origin: whiteList,
    credentials: true,
  });

  // eslint-disable-next-line no-console
  console.log(`Running Evironment: ${process.env.NODE_ENV || 'development'}`);
  await app.listen(3000, '0.0.0.0');
}
bootstrap();
