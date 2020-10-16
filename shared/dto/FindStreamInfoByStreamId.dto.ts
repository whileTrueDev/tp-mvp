import {
  ValidateNested, ArrayMinSize,
  ArrayMaxSize, IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { EachStreamData } from './EachStreamData.dto';

export class FindStreamInfoByStreamId {
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(2)
  @ArrayMaxSize(2)
  @Type(() => EachStreamData)
  streams: EachStreamData[];
}
