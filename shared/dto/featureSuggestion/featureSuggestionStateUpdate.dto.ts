import {
  IsNumber,
} from 'class-validator';

export class FeatureSuggestionStateUpdateDto {
  @IsNumber()
  id: number;

  @IsNumber()
  state: number;
}
