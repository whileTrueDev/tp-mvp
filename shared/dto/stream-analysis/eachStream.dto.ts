import {
  IsNumber, IsString, IsBoolean,
} from 'class-validator';

export class EachStream {
  @IsNumber()
  viewer;

  @IsNumber()
  chatCount;

  @IsNumber()
  smileCount;

  @IsString()
  startedAt;

  // @IsString()
  // platform;

  // @IsString()
  // userId

  // @IsString()
  // creatorId

  // @IsString()
  // title

  // @IsNumber()
  // fan

  // @IsNumber()
  // airTime

  @IsBoolean()
  isRemoved
}
