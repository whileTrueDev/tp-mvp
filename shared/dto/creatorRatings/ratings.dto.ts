import { IsNumber, IsOptional, IsString } from 'class-validator';

export class RatingPostDto {
  @IsString()
  @IsOptional()
  userId?: string;

  @IsNumber()
  rating: number;
}
