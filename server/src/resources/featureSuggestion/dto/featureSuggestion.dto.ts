import {
  IsString, IsNumber
} from 'class-validator';

export class FeatureSuggestionDto {
  @IsNumber()
  postId: number;
  @IsString()
  image: string;
}
