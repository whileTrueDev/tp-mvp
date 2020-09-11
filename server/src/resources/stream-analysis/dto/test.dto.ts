import {
  IsString, Length, isNotEmpty, IsArray, ArrayMinSize, ArrayMaxSize
} from 'class-validator';

export class Test {
  // @IsString()
  // @Length(2)
  // streamId: string;
  @IsArray()
  @ArrayMaxSize(2)
  @ArrayMinSize(2)
  streamIds: string[];
}
