import {
  ValidateNested,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EachStream } from './eachStream.dto';

export class PeriodData {
 @IsArray()
 @Type(() => EachStream)
 @ValidateNested({ each: true })
 public base: EachStream[];

//  @IsArray()
//  @Type(() => EachStream)
//  @ValidateNested({ each: true })
//  public compare: EachStream[];
}
