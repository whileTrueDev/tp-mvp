import { IsBoolean, IsString, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  id: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsString()
  password: string;
}
