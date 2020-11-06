import {
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EachStream } from './eachStream.dto';

export class SearchStreamInfoByPeriods {
  @IsArray()
  @Type(() => EachStream)
  base: EachStream[];

  @IsArray()
  @Type(() => EachStream)
  compare: EachStream[];
}
