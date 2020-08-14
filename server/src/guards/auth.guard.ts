import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // If return true: request will be processed
    // If return false: deny request
    return this.validateRequest(request);
  }

  private validateRequest(req): boolean | Promise<boolean> {
    return true;
  }
}
