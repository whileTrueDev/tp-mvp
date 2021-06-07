import * as dotenv from 'dotenv';

dotenv.config();

export const mailerConfig = {
  transport: {
    service: 'gmail',
    host: 'smtp.google.com',
    port: 587,
    secure: true,
    auth: {
      type: 'OAuth2',
      user: process.env.MAILER_AUTH_USER, // OAuth Client에서 테스트 사용자로 등록된 Gmail 주소 
      clientId: process.env.MAILER_AUTH_CLIENT_ID, // gmail  OAuth Client ID 
      clientSecret: process.env.MAILER_CLIENT_SECRET, //  OAuth Client 보안 비밀
      refreshToken: process.env.MAILER_REFRESH_TOKEN, // playground에서 발급받은 Refresh token
    },
  },
  defaults: {
    from: '"nest-modules" <modules@nestjs.com>',
  },
};
