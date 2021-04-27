import {
  IsIn, IsNumber, IsOptional, IsString,
} from 'class-validator';

export class RatingPostDto {
  @IsNumber()
  rating: number;

  @IsOptional()
  @IsString()
  userId?: string | undefined;

  @IsIn(['twitch', 'afreeca'])
  platform: string;
}
