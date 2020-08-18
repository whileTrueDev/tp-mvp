# tp-mvp

pilot project for True point

## server

nestjs 프레임워크를 사용하는 rest api 서버 폴더입니다.

vscode의 Material Icon Theme를 사용하고 있다면 `ctrl` + `,` => 우측 상단 `Open Settings(JSON)` 으로 설정을 연 이후 다음 내용을 추가하면 vscode Explorer에서 Nest와 관련된 파일, 폴더들이 더 명확한 아이콘으로 나타납니다.

```JSON
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
