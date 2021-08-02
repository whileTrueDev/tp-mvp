import * as dotenv from 'dotenv';

dotenv.config();

export const mailerConfig = {
  transport: {
    host: 'smtp.mailplug.co.kr',
    port: 465,
    secure: true,
    auth: {
      user: process.env.MAILER_USER,
      pass: process.env.MAILER_PASS,
    },
  },
  defaults: {
    from: 'support@mytruepoint.com',
  },
};

/**
 * {
  code: 'EAUTH',
  response: '535 5.7.0 553 sorry, that password allowed relay (#5.7.5)',
  responseCode: 535,
  command: 'AUTH PLAIN'
}와 같은 에러가 나면서 메일 발송이 안될 경우
POP3/IMAP 설정을 확인한다(30일간 사용기록 없는 경우 사용안함으로 자동 전환됨)
 */
