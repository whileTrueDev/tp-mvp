import {
  IsString, IsDateString,
} from 'class-validator';

export class SearchEachS3StreamData {
  @IsString()
  creatorId: string;

  @IsString()
  streamId: string;

  @IsDateString()
  startedAt: string;
}
