import {
  ValidateNested, ArrayMinSize,
  ArrayMaxSize, IsArray
} from 'class-validator';
import { Type } from 'class-transformer';
import { EachStream } from './eachStream.dto';

export class findStreamInfoByStreamId {
  @ValidateNested({ each: true })
  @Type(() => EachStream)
  streams: EachStream[];
}
