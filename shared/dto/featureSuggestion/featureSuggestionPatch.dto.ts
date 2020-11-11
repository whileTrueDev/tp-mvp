import {
  IsString, IsNumber,
} from 'class-validator';

export class FeatureSuggestionPatchDto {
  @IsNumber()
  suggestionId: number;

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
