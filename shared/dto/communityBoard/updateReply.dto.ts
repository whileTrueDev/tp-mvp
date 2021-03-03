import {
  IsString, MaxLength, IsNotEmpty,
} from 'class-validator';

export class UpdateReplyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  content: string;
}
