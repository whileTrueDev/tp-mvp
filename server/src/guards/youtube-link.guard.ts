import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class YoutubeLinkGuard extends AuthGuard('google') {}
