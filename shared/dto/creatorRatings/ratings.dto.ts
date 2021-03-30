import { IsNumber } from 'class-validator';

export class RatingPostDto {
  @IsNumber()
  rating: number;
}
