// 컨트롤러가 라우터의 역할을 한다.
// 데코레이터를 사용한다.
import {
  Controller, Post, Body, Get, UseGuards, UseInterceptors, ClassSerializerInterceptor, Query, Req
} from '@nestjs/common';
// import { RegistService } from './regist.service';
// 회원가입이기 때문에 다른 제약이 필요하지 않다.
// service는 해당 컨트롤러가 사용할 함수를 미리 정의하여 사용하기 위함이다.

@Controller('regist')
class RegistController {
  constructor(
    // private readonly registService : RegistService,
  ) {}
}
