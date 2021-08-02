import Joi from 'joi';
import loadConfig from './loadConfig';

export const validationSchema = Joi.object({
  // AWS credentials
  AWS_ACCESS_KEY_ID: Joi.string().required(),
  AWS_SECRET_ACCESS_KEY: Joi.string().required(),
  BUCKET_NAME: Joi.string().required(),
  // Jwt secret
  JWT_SECRET: Joi.string().required(),
  // IMPORT secret
  IMP_KEY: Joi.string().required(),
  IMP_SECRET: Joi.string().required(),
  // Slack Secret
  SLACK_ALARM_URL: Joi.string().required(),
  // Twitch Secrets
  TWITCH_CLIENT_ID: Joi.string().required(),
  TWITCH_CLIENT_SECRET: Joi.string().required(),
  // Google/Youtube Secrets
  YOUTUBE_CLIENT_ID: Joi.string().required(),
  YOUTUBE_CLIENT_SECRET: Joi.string().required(),
  // Afreeca Secrets
  AFREECA_KEY: Joi.string().required(),
  AFREECA_SECRET_KEY: Joi.string().required(),
  // Mailer account(트루포인트 메일링 계정 - ttps://mail.mytruepoint.com/)
  MAILER_USER: Joi.string().email().required(),
  MAILER_PASS: Joi.string().required(),
  // kakao
  KAKAO_REST_API_KEY: Joi.string().required(),
  // Naver
  NAVER_CLIENT_ID: Joi.string().required(),
  NAVER_CLIENT_SECRET: Joi.string().required(),
});

export default {
  isGlobal: true,
  load: [loadConfig],
  validationSchema,
};
