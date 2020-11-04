import {
  ValidateNested, ArrayMinSize,
  ArrayMaxSize, IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SearchEachStream } from './searchEachStreamData.dto';

export class SearchStreamInfoByStreamId {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @Type(() => SearchEachStream)
  streams: SearchEachStream[];
}
