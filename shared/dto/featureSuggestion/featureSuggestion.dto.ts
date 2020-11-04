import {
  IsString, IsNumber, IsDate,
} from 'class-validator';

export class FeatureSuggestionDto {
  @IsNumber()
  suggestionId: number;

  @IsNumber()
  category: number;

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

// export interface FeatureSuggestion {
//   @IsNumber()
//   suggestionId: number;

//   @IsNumber()
//   category: number;

//   @isString()
//   title: string;
//   @isString()
//   content: string;
//   @isString()
//   author: string;
//   @isString()
//   userId: string;
//   @IsNumber()
//   state: number;
//   @IsNumber()
//   like: number;
//   @IsDate()
//   createdAt: Date;

// }
