import { IsString } from 'class-validator';

export class FindUserStatisticInfo {
  @IsString()
  userId: string;
}
