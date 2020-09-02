import { Request } from 'express';
import { LogedinUser } from '../resources/auth/interfaces/loginUserPayload.interface';

export interface LogedInExpressRequest extends Request {
  user: LogedinUser
}
