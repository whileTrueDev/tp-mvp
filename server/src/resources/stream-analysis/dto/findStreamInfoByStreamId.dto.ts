import {
  IsString,
} from 'class-validator';

export class findStreamInfoByStreamId {
  @IsString()
  streamId: string;

  @IsString()
  platform: 'twitch' | 'afreeca' | 'youtube'
}
