import {
  IsString, IsNumber, MaxLength, IsOptional,
} from 'class-validator';

export class CreateCommunityPostDto {
  @IsString()
  @MaxLength(20)
  title: string;

  @IsString()
  content: string;

  @IsString()
  @MaxLength(12)
  nickname: string;

  @IsString()
  @MaxLength(4)
  password: string;

  @IsNumber()
  platform: number;

  @IsNumber()
  category: number;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  resources?: {fileName: string, src: string, signature: string}[]
}
