import {
  ArgumentsHost, Catch, ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';
import fronthost from '../constants/fronthost';

@Catch()
export class AfreecaLinkExceptionFilter implements ExceptionFilter {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.redirect(
      `${fronthost}/mypage/my-office/settings?error=${exception.message}`,
    );
  }
}
