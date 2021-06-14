import {
  IsString, IsNumber, MaxLength, IsArray, IsOptional,
} from 'class-validator';
import { ImageResource } from '../../interfaces/ImageResource.interface';


export class CreateCommunityPostDto {
  @IsString()
  @MaxLength(20)
  title: string;

  @IsString()
  content: string;

  @IsString()
  @MaxLength(12)
  nickname: string;

  @IsString()
  @MaxLength(4)
  password: string;

  @IsNumber()
  platform: number;

  @IsNumber()
  category: number;

  @IsArray()
  @IsOptional()
  resources?: Array<ImageResource>;

  @IsOptional()
  @IsString()
  userId?: string;

}
