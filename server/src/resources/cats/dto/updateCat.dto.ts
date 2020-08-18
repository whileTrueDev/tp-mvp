import { IsInt, IsString, IsOptional } from 'class-validator';

export class UpdateCatDto {
  @IsInt()
  id: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  age?: number;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsOptional()
  @IsString()
  photo?: string;
}
