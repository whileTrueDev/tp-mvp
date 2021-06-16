import {
  IsIn, IsNumber, IsString,
} from 'class-validator';

export class RatingPostDto {
  @IsNumber()
  rating: number;

  @IsString()
  userId: string;

  @IsIn(['twitch', 'afreeca'])
  platform: string;
}
