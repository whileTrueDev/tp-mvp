import {
  IsString, IsDateString, IsIn, IsNumber,
} from 'class-validator';

export class SearchEachS3StreamData {
  @IsString()
  creatorId: string;

  @IsString()
  streamId: string;

  @IsNumber()
  viewer: number;

  @IsDateString()
  startedAt: string;

  @IsIn(['afreeca', 'twitch', 'youtube'])
  platform: string;
}
