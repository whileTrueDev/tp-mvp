import {
  IsString,
} from 'class-validator';

export class CheckValidSubscription {
  @IsString()
  userId: string;

  @IsString()
  targetId: string;
}
