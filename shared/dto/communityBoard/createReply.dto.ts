import {
  IsString, MaxLength,
} from 'class-validator';

export class CreateReplyDto {
  @IsString()
  @MaxLength(12)
  nickname: string;

  @IsString()
  @MaxLength(4)
  password: string;

  @IsString()
  @MaxLength(100)
  content: string;
}
