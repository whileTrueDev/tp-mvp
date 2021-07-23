import {
  IsIn, IsOptional, IsString,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  userId: string;

  @IsString()
  @IsOptional()
  @IsIn(['m', 'f', 'other'])
  gender?: string; // m , f, other

  @IsString()
  @IsOptional()
  mail?: string;

  @IsString()
  @IsOptional()
  nickName?: string;

  @IsString()
  @IsOptional()
  profileImage?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsOptional()
  detailId?: number;

  @IsString()
  @IsOptional()
  youtubeChannelAddress?: string;
}
