# Authentication in Nest

Passport는 Nodejs 생태계에서 가장 유명한 인증 라이브러리입니다. Nest와 통합된 라이브러리는 @nestjs/passport 입니다. passport는 다음의 단계들을 진행할 수 있습니다.

- 유저를 credentilas를 확인하여 인증하는 것. (ID/PW, JWT(Json Web Token), id token from Identity Provider 등을 이용하여.)
- 인증된 상태 정보를 관리 (Express Session, JWT를 발행하는 과정 등.)
- Request 객체에 유저 인증에 대한 정보를 이후 route handler에서 사용가능하도록 Attach.

`@nestjs/passport`, `passport`, `passport-local`을 설치합니다.

```bash
$ npm install --save @nestjs/passport passport passport-local
$ npm install --save-dev @types/passport-local
```

local strategy가 아닌 다른 strategy를 사용하고자 한다면, `passport-<strategy you want>`를 추가로 설치하면 됩니다.

## auth 리소스 생성

- auth module
- auth service
- local strategy

## Passport Guard의 사용

Gaurd는 요청이 라우트핸들러에 의해 핸들링 될 지의 여부를 결정합니다. passport와 함께 사용될 수 있습니다 아래는 그 방법이 설명되어 있습니다.

먼저, 인증과 관련된 두가지 상태가 다음과 같이 있을 수 있습니다.

- 유저가 로그인 되어있지 않다. (is not authenticated)
- 유저가 로그인 되어 있다 (is authenticated)

첫번째 케이스에서는 두 함수가 필요합니다.

- 요청된 route에 대한 인증되지 않은 유저로부터의 액세스 제한.  
  Guard를 사용하여 이를 진행할 수 있습니다. Guard를 보호하고자 하는 route handler 위에 명시해주면 됩니다.

- 인증되지 않은 사용자가 로그인을 시도할 때 인증 단계를 시작.  
  이 단계는 유효한 사용자에게 JWT를 발행하는 단계입니다. 인증을 시작하려면 username/password 등을 POST 로 요청해야 하므로 이를 처리하기 위한 POST /auth/login route를 생성합니다. 해당 route handler함수 위에 @UseGaurds() 데코레이터를 명시하고, 인자로 passport AuthGuard를 넣어줘 올바른 passport strategy가 호출되도록 할 수 있습니다.

두번째 케이스는 Guard가 로그인한 사용자가 보호된 경로에 액세스할 수 있도록 하므로, 보호가 필요한 곳에 Gaurd를 적절히 설정해두면 됩니다.