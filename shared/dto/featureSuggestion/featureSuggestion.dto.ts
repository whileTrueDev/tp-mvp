import {
  IsString, IsNumber, IsDate,
} from 'class-validator';

export class FeatureSuggestionDto {
  @IsNumber()
  suggestionId: number;

  @IsString()
  category: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  author: string;

  @IsString()
  userId: string;

  @IsNumber()
  state: number;

  @IsNumber()
  like: number;

  @IsDate()
  createdAt: Date;
}
