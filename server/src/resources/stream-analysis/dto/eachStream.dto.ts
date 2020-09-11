import {
  IsString, Length, isNotEmpty, IsIn
} from 'class-validator';

export class EachStream {
  @IsString()
  @Length(2)
  streamId: string;

  @IsIn(['twitch', 'afreeca', 'youtube'])
  platform: string;
}
