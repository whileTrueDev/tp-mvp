import {
  IsString, IsDateString, IsIn,
} from 'class-validator';

export class SearchEachS3StreamData {
  @IsString()
  creatorId: string;

  @IsString()
  streamId: string;

  @IsDateString()
  startedAt: string;

  @IsIn(['afreeca', 'twitch', 'youtube'])
  platform: string;
}
