import {
  ValidateNested, ArrayMinSize,
  ArrayMaxSize, IsArray
} from 'class-validator';
import { Type } from 'class-transformer';
import { EachStream } from './eachStream.dto';

export class FindStreamInfoByStreamId {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @Type(() => EachStream)
  streams: EachStream[];
}
