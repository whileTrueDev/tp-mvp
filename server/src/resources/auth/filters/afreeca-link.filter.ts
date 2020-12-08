import {
  ArgumentsHost, Catch, ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';
import getFrontHost from '../../../utils/getFrontHost';

@Catch()
export class AfreecaLinkExceptionFilter implements ExceptionFilter {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    response.redirect(
      `${getFrontHost()}/mypage/my-office/settings?error=${exception.message}`,
    );
  }
}
