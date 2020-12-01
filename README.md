# tp-mvp

pilot project for True point

## 코드 품질 관리

Truepoint의 대부분의 서비스는 typescript로 작성됩니다.  
대부분의 javascript(typescript 역시) 프로젝트에서 코드의 규칙을 지정하고 올바른 규칙에 맞게 작성할 수 있도록 Eslint를 사용합니다.  
prettier를 통해 코드 저장 시 올바른 코딩 방식으로의 자동 수정기능을 덧붙여 사용하여 더욱 쉽고 빠르게 코딩표준을 적용할 수 있습니다.  
Truepoint는 Vscode에서 코드를 작성하기를 권장합니다. 앞서 말한 기능을 사용하기 위해 코드 품질 관리 툴을 설치합니다.  
Eslint Vscode Extension을 설치해 주세요. ( Extensions => eslint 검색 => install and enable )

이후 `Cmd` + `,` (windows: `ctrl` + `,`) 단축어를 입력하여 vscode setting 파일을 열고, 우측 상단의 open settings(JSON) 버튼을 클릭 해 `settings.json` 파일을 열어 아래의 내용을 최하단에 추가합니다.

```JSON
// typescript semantic highlighting
"editor.semanticHighlighting.enabled": true,
// These are all my auto-save configs
"editor.formatOnSave": true,
// turn it off for JS and JSX, we will do this via eslint
"[javascript]": {
    "editor.formatOnSave": false,
    "editor.tabSize": 2
},
"[javascriptreact]": {
    "editor.formatOnSave": false,
    "editor.tabSize": 2
},
"[typescript]": {
    "editor.formatOnSave": false,
    "editor.tabSize": 2
},
"[typescriptreact]": {
    "editor.formatOnSave": false,
    "editor.tabSize": 2
},
// eslint config
"eslint.packageManager": "yarn",
"eslint.codeAction.showDocumentation": {
    "enable": true
}
```

추가적으로 vscode에서 개발 생산성 향상을 위해 다음의 코드를 추가할 수 있습니다. vscode의 Explorer에서 검색 시 포함되지 않을 파일 또는 폴더를 설정합니다.

```json
// 검색시 검색되지 않을 파일 및 디렉토리 설정
"search.exclude": {
    "**/.git": true,
    "**/node_modules": true,
    "**/bower_components": true,
    "**/tmp": true,
    "**/build": true,
    "**/dist": true,
    "**/yarn.lock": true,
    "**/*.log": true,
},
```

## Vscode Explorer 아이콘 설정

truepoint의 REST API 서비스는 nestjs 프레임워크를 사용합니다. nestjs는 일관화된 방식으로 Nodejs Backend 앱을 개발할 수 있게 도와줍니다.  
nestjs는 Angular의 철학과 개념을 많은 부분 차용하였고, 그에 따르는 여러 개념과 그에 따르는 파일 네이밍 룰이 있습니다.  
vscode의 material-icon-theme 확장프로그램을 사용하면 탐색기에서 더욱 쉽고 명확하게 파일과 폴더를 구분할 수 있습니다.

vscode의 Material Icon Theme를 설치합니다. ( Extensions => material-icon-theme 검색 => intsall and enable )  
기본적으로 material-icon-theme는 nestjs 방식의 파일들을 Angular 아이콘으로 표시합니다. nestjs 아이콘으로 변경하기 위해 다음의 과정을 진행합니다.

 `Cmd` + `,` (windows: `ctrl` + `,` )=> 우측 상단 Open Settings(JSON) 버튼으로 설정파일을 열어 다음 내용을 추가합니다.  
 이를 통해 vscode Explorer에서 Nest와 관련된 파일, 폴더들이 더 명확한 아이콘으로 나타납니다.

```JSON
// material-icon-theme config
"material-icon-theme.files.associations": {
    "*.pipe.ts": "nest-pipe",
    "*.guard.ts": "nest-guard",
    "*.controller.ts": "nest-controller",
    "*.module.ts": "nest-module",
    "*.service.ts": "nest-service",
    "*.middleware.ts": "nest-middleware",
    "*.filter.ts": "nest-filter",
    "*.interface.ts": "typescript-def",
    "*.dto.ts": "nest-resolver",
    "*.strategy.ts": "key",
    "*.entity.ts": "sequelize",
    "*.config.ts": "settings",
    "*.style.ts": "css",
    "*.roles.ts": "nest-decorator",
    "*.decorator.ts": "nest-decorator",
},
"material-icon-theme.folders.associations": {
    "interfaces": "typescript",
    "atoms": "react-components",
    "organisms": "core",
    "dto": "delta",
    "strategies": "keys",
    "entities": "database"
}
```

## 설치 및 실행

truepoint의 모든 서비스는 패키지 매니저로 yarn을 사용합니다. 먼저 yarn을 설치한 이후, yarn을 통해 각 서비스 폴더의 의존라이브러리를 설치합니다.
[yarn 공식 홈페이지 - 설치](https://classic.yarnpkg.com/en/docs/install#mac-stable)

다음의 명령어를 통해 의존 라이브러리를 설치 합니다.

```bash
cd client
yarn
```

```bash
cd server
yarn
```

다음의 명령어를 통해 각 서버를 실행합니다

- 프론트 엔드

```bash
# 윈도우즈 OS
yarn start
# 맥OS
yarn start:mac
```

- 백엔드

```bash
# OS 구분 없이 실행 스크립트 동일합니다.

# dev환경 ( hot reloading )
yarn start:dev
```

## repository 구성 변경 (2020.10.14 ~)

### monorepo

monorepo란 다양한 모듈을 여러 리파지토리로 관리하지 않고, 하나의 리파지토리에서 관리하는 것을 의미합니다.
monorepo로서 여러 모듈을 함께 관리하게 되면 전역적으로 eslint나 husky, tsconfig 등에 대해 설정 하여 통일성있는 프로젝트 관리에 용이하며, 각 모듈 간 의존이 필요한 경우에 용이합니다.

tp-mvp 프로젝트에서는 monorepo로 프로젝트를 관리하고자 합니다.
이로인해 변경되는 폴더 구조는 다음과 같습니다

- 현재

```tree
tp-mvp
  client
    web
      package.json
      node_modules
      yarn.lock
      .eslintrc
    admin
      package.json
      node_modules
      yarn.lock
      .eslintrc
  server
    package.json
    node_modules
    yarn.lock
    .eslintrc
```

- 이후

```tree
tp-mvp
  client
    web
      package.json
    admin
      package.json
  server
    package.json
  shared
    package.json
  node_modules
  yarn.lock
  .eslintrc
```

### tp-mvp의 프로젝트 구조 변경점

> 기존 UI 및 웹 페이지 리액트 서버는 client/web, Nest API 서버는 server 폴더에 관리되어 왔으며, HTTP/S 연결로 서로 통신하며 데이터를 주고 받는 형태입니다. useAxios hook을 통해 백엔드로 데이터를 요청하고, 저희는 백엔드로 부터 응답된 데이터를 받아와 리액트 내부에서 해당 데이터를 렌더링 하는 방식으로 데이터를 다루고 있습니다.

위의 과정에서 **프론트엔드**는 **백엔드로부터 응답되는 데이터의 형태가 어떻게 되는 지 알아야** 합니다. 기본적으로 axios에서 백엔드로부터 반환되는 데이터 객체인`res.data`의 타입은 `any`로 설정되어 있습니다. `res.data`를 `any`가 아닌 알맞은 타입 또는 인터페이스를 갖게 하기 위해서는 axios 요청시 generic을 통해 `res.data`의 타입을 명시해주어야 합니다.

또한 **백엔드**는 프론트엔드로부터 API 요청시 전송될 정확한 데이터의 형태(data transfer object, DTO)를 정의해 두어야 하며, 그 정의된 데이터 형태에 올바르게 맞는 데이터를 전송하였는가를 확인해야 합니다. 더불어 **프론트엔드로 응답할 데이터의 형태를 정의해 두어야 하며, 프론트엔드와는 해당 반환될 타입정보를 공유하는 것이 바람직**합니다.

기존의 tp 프로젝트에서는 백엔드의 경우 DTO를 정의하고, 응답할 데이터 형태역시 정의해서 사용하고 있습니다. 하지만 프론트엔드에서는 대개의 경우 백엔드로부터 응답받은 데이터의 형태를 모른채(`any`로 둔 채) 작업을 진행해왔습니다. 이 작업이 강제되지 않았으며 귀찮기도 했죠.

이제는 백엔드와 프론트엔드간 동시에 필요한 정보를 `shared` 라는 새로운 모듈에서 정의하고 백엔드와 프론트에서 shared를 참조하여 사용하고자 합니다.

`shared` 모듈은 다음 두 가지 종류의 파일을 정의해 두는 곳으로 사용합니다.

1. 데이터 전송 객체인 DTO - `class-validator` 사용 가능합니다.
2. 프론트엔드가 백엔드로부터 반환받는 데이터 ( 백엔드의 특정 라우터가 반환하는 데이터 )의 타입 - typescript interface
2-1. 응답하는 데이터가 엔터티와 관계가 깊은 경우, 이 interface 는 각 리소스 Entity 에서 implement 하는 등 해당 entity의 모체로서 사용 할 수 있습니다.)

### 해당 변경사항이 적용 된 이후 코딩 방법

#### Frontend

1. 모든 useAxios 요청에서 `useAxios<SomeResponseType>` 와 같이 generic으로 반환받는 데이터 형태를 명시합니다.
2. 모든 useAxios 요청에서 함께 보내는 데이터 (GET method 의 경우 `params`, POST,PATCH,DELETE의 경우 `data` 객체) 형태를 명시합니다. 
3. 위에서 명시하는 모든 타입(DTO, interface, type)은 `shared` 모듈 에서 가져옵니다.

- 예시1) shared의 Notice entity 의 모체가 되는 interface

```ts
export interface Notice {
  id: number;

  category: string;
}
```

- 예시1-1) client의 데이터 요청이 필요한 컴포넌트

```ts
import { Notice } from '@truepoint/shared/dist/interface/Notice.interface';
import { NoticeGetDto } from '@truepoint/shared/dist/dto/NoticeGet.dto';

export function SomeComponent() {
  const dto: NoticeGetDto = { userId: 'userId1' };
  const [{data, loading}] = useAxios<Notice>(
    { url: '/notice', method: 'get', params: dto }
  )
  return (<div>카테고리: {loading ? 'loading...' : data.category}</div>)
}
```

#### Backend

1. 모든 POST, PATCH, PUT, DELETE 요청 핸들러에는 DTO 를 정의하고, ValidationPipe로 요청 데이터에 대해 검사합니다.  
(GET 요청 핸들러에는 DTO를 사용하거나 하지 않아도 됩니다.)
2. 모든 라우터의 응답 데이터에 대한 형태를 명시합니다. 즉, controller의 각 메소드(요청 핸들러)에 반환 타입을 명시합니다.
3. 모든 Entity 정의 시, 해당 Entity의 모체가 되는 interface를 implements 하여 정의합니다.
4. 위에서 명시한 모든 타입(DTO, 응답 데이터)은  `shared` 모듈에서 가져옵니다.

- 예시2) shared의 Notice entity 의 모체가 되는 interface

```ts
export interface Notice {
  id: number;

  category: string;
}
```

- 예시2-1) server/resources/notice/entities/notice.entity.ts

```ts
import { Notice } from '@truepoint/shared/dist/interfaces/Notice.interface';
import {
  Column, Entity, PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('Notice')
export class NoticeEntity implements Notice { // shared의 Notice 인터페이스를 모체로 사용.
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '공지사항 구분' })
  category: string;
}
```

- 예시2-2) server/resources/notice/notice.controller.ts

```ts
import { Notice } from '@truepoint/shared/dist/interfaces/Notice.interface';
import { NoticeGetDto } from '@truepoint/shared/dist/dto/NoticeGet.dto';
import { Controller, Get } from '@nestjs/common';

@Controller('notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Post()
  async create(
    @Body() dto: NoticeGetDto,
  ): Promise<Notice[]> {
    return this.noticeService.create(dto);
  }
```

#### shared 모듈을 참조하는 방법

- dto
`import { SomethingDto } from '@truepoint/shared/dist/dto/Something.dto';`
- 반환 데이터 타입 또는 entity 모체 타입
`import { SomeResponseType } from '@truepoint/shared/dist/interfaces/Something.dto';`

#### 예외적 상황

- Backend 의 Entity와는 아무 상관없는 형태의 데이터를 응답할 때
shared/res 폴더에 해당응답의 interface를 정의한 후 client의 useAxios 요청, 백엔드server의 라우트 핸들러 에서 같은 타입을 공유

### 설치 및 실행

설치

- 이제 각 폴더에 server, client/web, client/admin, shared 에서 각각 yarn install 을 통해 dependencies를 설치하지 않아도 됩니다.
각 폴더 또는 최상위 폴더에서 `yarn install`(yarn)을 한 번만 진행하면 알아서 server, client/web, client/admin 등에 dependencies가 모두 설치됩니다.

실행

- 실행은 기존과 같이 server -> `yarn start:dev`, client/web -> `yarn start`, client/admin -> `yarn start` 로진행합니다.
- shared 는 독립적으로 실행할 일은 없습니다. 대신, server, client/web, client/admin에서 shared 에 정의된 DTO 또는 interface 등을 참조 하는 경우, shared/dist 의 컴파일된 js 파일을 필요로 하기 때문에, 변경사항이 있는 경우 `yarn build` 를 통해 ts -> js 컴파일을 진행해야 합니다. 편하게 개발 하기 위해서는 변경사항이 있을 때마다 빌드가 진행되도록 하여야 합니다. **yarn start:dev 스크립트로 변경 사항이 있을 때마다 컴파일 하는 환경을 구축해 두었습니다.**
- 간단히 말해 shared 역시 `yarn start:dev`로 실행해 둔 채 작업을 진행하는 것이 편합니다.

### eslint 및 관리 관련 변경사항

- **커밋 단계 lint 제한**
  `husky`와 `lint-staged` 를 통해 git 커밋시, **현재 staged 상태인 파일들에 대해 eslint 검사**하고, 해당 검사에서 eslint를 통과하지 못하면 (error 가 하나라도 있다면) 커밋이 진행되지 않도록 제한합니다.
- **PR 단계 lint 제한**
  `github actions`를 통해 PR시, 변경한 파일 만을 포함하는 것이 아닌, 각 모듈의 모든 파일에 대해 eslint 검사 진행하여 미 통과 시 merge가 불가하도록 제한합니다.
예시1.) server와, client/web에서 무언가를 변경사항이 있는 PR이면, server 폴더와 client/web 폴더의 모든 파일을 eslint 검사합니다.
예시2.) server 에서만 무언가를 변경한 경우, server 폴더의 모든 파일에 대해서 eslint 검사를 진행합니다.
- **PR 단계 테스트 제한 ( 향후 업데이트 사항 )**
  `github actions`를 통해 PR시, jest 단위 테스트 진행하여 coverage가 특정 수준 이하인 경우 merge가 불가하도록 제한합니다.
