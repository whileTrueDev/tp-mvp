import {
  IsString, MaxLength, IsNotEmpty,
} from 'class-validator';

export class UpdateReplyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(4)
  password: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  content: string;
}
