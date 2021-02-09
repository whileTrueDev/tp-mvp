import { IsString, IsNumber, MaxLength } from 'class-validator';

export class CreateCommunityPostDto {
  @IsString()
  @MaxLength(80)
  title: string;

  @IsString()
  content: string;

  @IsString()
  @MaxLength(20)
  nickname: string;

  @IsString()
  @MaxLength(20)
  password: string;

  @IsNumber()
  platform: number;

  @IsNumber()
  category: number;
}
