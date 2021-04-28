import {
  IsBoolean,
  IsOptional,
  IsString,
} from 'class-validator';

export class FeatureSuggestionPostDto {
  @IsString()
  category: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  userId: string;

  @IsString()
  password?: string;

  @IsString()
  author: string;

  @IsBoolean()
  @IsOptional()
  isLock?: boolean;
}
