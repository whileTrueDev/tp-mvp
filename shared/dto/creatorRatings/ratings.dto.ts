import { IsNumber, IsOptional, IsString } from 'class-validator';

export class RatingPostDto {
  @IsNumber()
  rating: number;

  @IsOptional()
  @IsString()
  userId?: string | undefined;
}
