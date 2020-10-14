import helmet from 'helmet';
import cookieParser from 'cookie-parser';
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
  // bodyparser는 이미 활성화되어있다.

  // helmet
  app.use(helmet());

  // cookie parser
  app.use(cookieParser('@#@$MYSIGN#@$#$')); // cookie parser 설정

  const whiteList = ['http://localhost:3001'];
  app.enableCors({
    origin: whiteList,
    credentials: true,
  });

  await app.listen(3000);
}
bootstrap();
