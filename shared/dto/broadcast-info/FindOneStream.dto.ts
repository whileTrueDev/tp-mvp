import { IsString } from 'class-validator';

export class FindOneStreamDto {
  @IsString()
  streamId: string;
}
