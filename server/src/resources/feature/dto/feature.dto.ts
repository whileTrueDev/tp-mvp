import {
  IsString, IsNumber, Length
} from 'class-validator';

export class FeatureDto {
  @IsNumber()
  postId: number;
  @IsString()
  image: string;
}
