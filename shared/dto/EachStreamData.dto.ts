import {
  IsString, IsIn,
} from 'class-validator';

export class EachStreamData {
  @IsString()
  streamId: string;

  @IsIn(['twitch', 'afreeca', 'youtube'])
  platform: string;
}
