import { IsString } from 'class-validator';

export class SearchUserStatisticData {
  @IsString()
  userId: string;
}
