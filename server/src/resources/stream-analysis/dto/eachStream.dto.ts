import {
  IsString, Length
} from 'class-validator';

export class EachStream {
  @IsString()
  @Length(2)
  streamId: string;

  @IsString()
  platform: 'twitch' | 'afreeca' | 'youtube'
}
