import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateCommunityPostDto {
  @IsString()
  @MaxLength(20)
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  resources?: {fileName: string, src: string, signature: string}[]

  @IsOptional()
  @IsString()
  userId?: string;
}
