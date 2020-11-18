import {
  IsNumber,
} from 'class-validator';

export class FeatureSuggestionPatchRequest {
  @IsNumber()
  id: number;

  @IsNumber()
  state: number;
}
