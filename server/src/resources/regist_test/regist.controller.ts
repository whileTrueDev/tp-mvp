// 컨트롤러가 라우터의 역할을 한다.
// 데코레이터를 사용한다.
import {
  Controller, Post, Body, Get, UseGuards, UseInterceptors, ClassSerializerInterceptor, Query, Req
} from '@nestjs/common';

// 회원가입이기 때문에 다른 제약이 필요하지 않다.
// 
