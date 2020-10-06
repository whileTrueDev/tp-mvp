import {
  IsNumber
} from 'class-validator';

export class FeatureSuggestionDeleteRequest {
  @IsNumber()
  id: number;
}
