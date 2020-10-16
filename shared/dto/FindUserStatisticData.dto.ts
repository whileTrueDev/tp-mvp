import { IsString } from 'class-validator';

export class FindUserStatisticData {
  @IsString()
  userId: string;
}
