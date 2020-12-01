import {
  IsString, IsIn,
} from 'class-validator';

export class SearchEachStream {
  @IsString()
  streamId: string;

  @IsIn(['twitch', 'afreeca', 'youtube'])
  platform: string;
}
