import { IsOptional, IsString } from 'class-validator';

export class CreateCommentDto {
  @IsOptional()
  @IsString()
  userId?: null | string;

  @IsString()
  nickname: string;

  @IsString()
  password: string;

  @IsString()
  content: string;
}
