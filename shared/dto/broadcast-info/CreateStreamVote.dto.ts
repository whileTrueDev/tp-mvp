import { IsIn, IsOptional, IsString } from 'class-validator';

export class CreateStreamVoteDto {
  @IsOptional()
  id?: number;

  @IsString()
  streamId: string;

  @IsString()
  @IsIn(['twitch', 'afreeca'])
  platform: string;

  @IsString()
  @IsIn(['up', 'down'])
  vote: string;

  @IsString()
  @IsOptional()
  userId?: string;
}
