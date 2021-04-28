import { IsIn, IsString } from 'class-validator';

export class FindOneStreamDto {
  @IsString()
  @IsIn(['twitch', 'afreeca'])
  platform: string;

  @IsString()
  streamId: string;
}
