import {
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
  author: string;
}
