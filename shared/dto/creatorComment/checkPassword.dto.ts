import { IsString } from 'class-validator';

export class CheckPasswordDto {
  @IsString()
  password: string;
}
