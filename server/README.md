# Nestjs

Nodejs로 인해 Javascript 로 클라이언트 사이드 와 서버 사이드 코드를 함께 작성할 수 있게 된 이래로, javascript 생태계는 많은 성장을 이뤘습니다. 그 중, 프론트엔드 진영에 Angular, React, Vue와 같은 멋진 프로젝트들이 진행되어, 더욱 많은 개발자로 하여금 정해진 아키텍처 내에서 작업하여 더욱 높은 생산성을 가지며 더 빠른 속도로 프론트엔드 서비스를 제작할 수 있게 되었습니다. 반면, 백엔드 진영에는 훌륭한 라이브러리 및 툴은 존재하지만, "아키텍처" 라는 문제를 해결하는 도구는 아직 존재하지 않습니다. Nest는 개발자가 정해진 규칙 안에서 코드를 작성할 수 있는 아키텍처를 제공합니다. 이를 통해 테스트하기 쉽고 확장 가능하며 느슨하게 결합되어 있으며 유지 보수가 쉬운 애플리케이션을 작성할 수 있게 도와 생산성을 향상 시킵니다. 

Nest는 Typescript를 완벽하게 지원합니다. Typescript와 함께 사용했을 때 그 효과가 더욱 큽니다. Nest는 Angular로부터 많은 영감을 받아 제작되어, 기존에 Angular에 익숙하다면 Nest의 개념들을 더욱 쉽게 익히고, Nest를 적용할 수 있습니다.

시범적으로  `Cat` 리소스의 정보를 반환하는 과정을 특정 개념에 따라 작성하며 Nest의 필수 개념들을 알아보도록 하겠습니다.

## Controller

Controller는 Request를 받고 클라이언트에게 Response 를 보내는 역할을 합니다. 즉, Routing 제어를 담당합니다.

대부분의 경우 각 Controller는 여러 개의 route를 가지고 있고, 각 route는 다른 작업이 진행됩니다. class 위에 `@Controller()` 데코레이터를 명시하여 Controller 클래스를 생성할 수 있습니다.

### Routing

GET /cats 로 요청하면 "All Cats" 라는 문자열을 응답하는 Controller를 작성합니다.

```tsx
// cats.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';

@Controller('cats')
export class CatsController {
  constructor(private catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(): Promise<Cat[]> {
    return this.catsService.findAll();
  }
}
```

`@Get()` 데코레이터는 해당 메소드가 특정 엔드포인트에 Get 방식의 요청에 대한 핸들러임을 명시합니다. @Get() 이외에도 @Post(), @Put(), @Delete(), @Patch(), @Options 각 특정 HTTP 메소드에 대한 핸들러임을 명시할 수 있습니다.

CatsService, CreateCatsDto와 같은 클래스는 곧이어 알아봅니다. 간단하게 설명하면 Service는 DB에 접근하여 리소스를 관리하는 클래스이며 Dto는 Data Transfer Object로, 데이터 전송 정보를 나타냅니다.

## Provider

Provider는 Service, Repository, Factory, Helper 등이 포함되는 개념입니다. Provider의 주요 아이디어는 Dependency Injection입니다. 앞서 말한 것들과 같은 여러 클래스는 서로 다양한 관계를 맺을 수 있습니다. Service, Repository 등의 클래스의 인스턴스를 효율적으로 연결하는 작업은 Nest가 관리합니다. Service, Repository, Factory, Helper, 사용자정의 Provider 등은 `@Injectable()` 데코레이터를 명시하여 생성할 수 있습니다.

**Dependency Injection(의존성 주입)**
의존성 주입이란 객체 지향 개발에서 하나의 객체가 다른 객체의 의존성을 제공하는 테크닉입니다.
Nest는 의존성 주입 디자인 패턴을 기반으로 구축되어 있습니다. constructor() 함수를 통해 주입된 의존성에 접근할 수 있습니다.

### Service

Service는 데이터 저장 및 검색을 담당합니다. Database를 사용한다면 데이터베이스에 접근하는 작업은 Service에서 진행합니다. 대개 각 리소스를 다루는 Service를 생성하여 작업합니다.

```tsx
// cats.service.ts
import { Injectable } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';

@Injectable()
export class CatsService {
  private readonly cats: Cat[] = [];

	// maybe DB Insert
  create(cat: Cat) {
    this.cats.push(cat);
  }

	// maybe DB Select
  findAll(): Cat[] {
    return this.cats;
  }
}
```

### Repository

Repository는 ORM에서 한 Entity의 데이터에 접근할 수 있도록 도와주는 클래스입니다. Repository를 통해  데이터를 조회하거나 생성하는 등 조작을 가할 수 있습니다. 대개 생성하여 사용하지는 않고, ORM 에 의해 제공되는 것을 사용합니다.

### Provider를 사용하기

Provider를 정의한 이후에는 동일한 리소스를 다루는 Controller와 함께 사용하고 의존성을 주입할 수 있도록 Nest에 등록해야 합니다. 모듈 파일을 생성한 뒤("모듈" 개념에 대해서는 이후에 알아봅니다.),  `@Module()` 데코레이터에 providers 배열에 등록할 Provider를 추가하여 해당 모듈 안의 Controller와 Provider가 의존성 주입을 통해 서로에게 접근 할 수 있도록 합니다.

```tsx
import { Module } from '@nestjs/common';
import { CatsController } from './cats/cats.controller';
import { CatsService } from './cats/cats.service';

@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class AppModule {}
```

## Module

## Middleware

## Exception Filter

## Pipe

Pipe는 `@Injectable()` 데코레이터를 명시하여 생성할 수 있고, 언제나 `PipeTransform` 인터페이스를 implement 해야합니다.

Pipe는 대개 다음의 두 가지 작업이 필요한 상황에 사용됩니다.

- **Validation (유효성 검사)**

    인풋 데이터가 유효한 데이터 인지 평가(evaluate)하여, 올바른 경우 그 데이터를 바꾸지 않고 간편하게 다음 단계로 이어지도록 하고, 올바르지 못한 경우 예외를 던지는 등의 작업.

- **Transformation (형 변환)**

    인풋 데이터를 원하는 포맷으로 변경하는 작업. 예를 들어 `string`을 `number`로 변환하는 것과 같은 작업.

Nest는 라우터의 메소드가 호출되기 이전에 Pipe를 삽입하여 실행합니다. Pipe는 라우터의 메소드로 향하는 `arguments`들을 들고 오게 되고, 이 arguments에 접근하여 작업을 진행할 수 있습니다. 라우트의 메소드가 호출되기 이전에 유효성 검사가 처리되어 불완전하거나 유효하지 못한 요청은 라우트 메소드가 호출되기 전에 오류를 발생시키고, 따라서 라우트 메소드는 더욱 안전하게 작업할 수 있습니다.

Nest는 곧바로 사용할 수 있는 많은 Built-in Pipe를 제공하고 있습니다. 사용자 정의 Pipe를 제작하여 사용할 수도 있습니다.

### Schema based validation

DTO를 정의해 두었다면 class-validator 라이브러리를 사용하여 인풋 데이터를 유효성 검사할 수 있습니다.  class-validator로 validation 과정을 진행하는 사용자 정의 Pipe를 만드는 방법으로 진행됩니다.

```tsx
// validation.pipe.ts
import {
  PipeTransform, Injectable, ArgumentMetadata, BadRequestException, Type
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  private types: Type<any>[] = [String, Boolean, Number, Array, Object];

  async transform(value: any, { metatype }: ArgumentMetadata): Promise<any> {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation Failed');
    }
    return value;
  }

  private toValidate(
    metatype:
      Type<any>
  ): boolean {
    return !this.types.includes(metatype);
  }
}
```

- PipeTransform 에 정의되어 있는 transform 메소드를 오버라이딩합니다. transform 메소드는 비동기 함수로 선언할 수 있습니다. class-validator의 유효성 검사 작업은 async 로 처리될 수 있으므로 transform을 비동기 함수로 선언했습니다.
- class-transformer의 plainToClass 메소드를 사용해 plain javascript object를 typed object로 변환합니다. (class-transformer와 class-validator는 같은 저자로부터 만들어진 라이브러리입니다. 따라서 호환성이 좋습니다.) class-transformer에 의해 타입 정의된 인풋 데이터를  validate 함수로 사전에 class-validator를 통해 정의한 DTO와 검사합니다.
- 유효성 검사이므로 값을 변경하지 않고 반환하거나, BadRequest에러를 발생시킵니다.

위에서 생성한 `ValidationPipe`는 매개 변수 범위, 메소드 범위, 컨트롤러 범위 또는 전역 범위에서 사용될 수 있습니다. 예를 들어 메소드 범위에서 validation 작업을 진행하고자 한다면 다음과 같이 작성할 수 있습니다.

```tsx
// cats.controller.ts
@Post()
async create(@Body(new ValidationPipe()) createCatDto: CreateCatDto) {
	this.catsService.create(createCatDto)
}
```

`POST /cats`로 올바르지 못한 요청을 보내게 되면 다음과 같은 결과를 반환하게 됩니다.

![https://s3-us-west-2.amazonaws.com/secure.notion-static.com/91ac902e-203c-4f3e-82aa-defd9aab3d9f/Untitled.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/91ac902e-203c-4f3e-82aa-defd9aab3d9f/Untitled.png)

### **Transformation input data**

Pipe는 위에서도 언급했 듯, 인풋 데이터를 변환하는 용도로 사용할 수 있습니다. 가장 간단하게 예를 들면, String → Integer 와 같은 작업이 여기에 포함될 수 있습니다. 이 외에도 필수 데이터 필드를 누락 한 경우에 default value를 추가하는 작업 역시 포함될 수 있습니다. 사용자로 부터의 요청과 그 요청을 처리하는 작업 사이에서 말입니다.

ParseIntPipe 라는 built-in Pipe가 어떻게 구성되어 있는 지를 보며 Pipe에서의 인풋 데이터 변환의 예를 확인해 보겠습니다.

```tsx
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }
    return val;
  }
}
```

내부적으로 이렇게 구성되어 있으며 이 Pipe를 method 범위에서 사용할 때의 예시는 다음과 같습니다.

```tsx
@Get(':id')
async findOne(@Param('id', new ParseIntPipe()) id) {
  return this.catsService.findOne(id);
} 
```

## Guard

Guard는 `@Injectable()` 데코레이터를 명시하여 사용할 수 있습니다. `CanActivate` 인터페이스를 implement 해야 합니다.

Guard는 주어진 요청이 해당 요청에 대한 handler를 트리거할 수 있을 지 없을 지를 특정 조건에 따라 결정하는 역할을 합니다. 대개 인증 및 인가 작업이 Guard가 하는 일에 해당됩니다. 기존의 Express에서 인증 및 인가 작업은 대개 미들웨어에 의해 진행되었습니다. 미들웨어로 인증 및 인가에 대한 작업을 진행하는 것 역시 좋은 방법이지만, 특정 라우트 및 route handler에 경로에 강력하게 결합 되기는 힘들었습니다.  
기본적으로 미들웨어는 next()를 호출한 이후 어떤 핸들러가 호출될 지 알지 못합니다. 반면에 Guard는 ExecutionContext 인스턴스에 접근할 수 있어, Guard 실행 이후 어떤 핸들러가 실행될 지 정확하게 알 수 있도록 디자인 되어 있습니다. 사용자의 요청과 해당 요청의 handler 사이에 위치시켜 명확하고 정확하게 작업을 처리할 수 있도록 합니다.

특정 라우트는 특정 권한을 만족하는 요청자에게만 사용 가능해야 합니다.    

## Interceptor

## 끝내며