import {
  IsString, IsIn,
} from 'class-validator';

export class EachStream {
  @IsString()
  streamId: string;

  @IsIn(['twitch', 'afreeca', 'youtube'])
  platform: string;
}
