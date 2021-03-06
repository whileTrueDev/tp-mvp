import {
  ArgumentsHost, Catch, ExceptionFilter,
} from '@nestjs/common';
import { Request, Response } from 'express';
import getFrontHost from '../../../utils/getFrontHost';

@Catch()
export class TwitchLinkExceptionFilter implements ExceptionFilter {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  catch(exception: any, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    response.redirect(
      `${getFrontHost()}/mypage/my-office/settings?${request.url.split('?')[1]}`,
    );
  }
}
