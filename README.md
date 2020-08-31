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
// eslint config
"eslint.packageManager": "yarn",
"eslint.codeAction.showDocumentation": {
    "enable": true
}
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
