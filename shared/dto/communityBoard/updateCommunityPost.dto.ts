import {
  IsString, MaxLength, IsArray, IsOptional,
} from 'class-validator';
import { ImageResource } from '../../interfaces/ImageResource.interface';

export class UpdateCommunityPostDto {
  @IsString()
  @MaxLength(20)
  title: string;

  @IsString()
  content: string;

  @IsArray()
  @IsOptional()
  resources?: Array<ImageResource>;

  @IsOptional()
  @IsString()
  userId?: string;

}
