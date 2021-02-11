import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateCommunityPostDto {
  @IsString()
  @MaxLength(20)
  title: string;

  @IsString()
  content: string;

  @IsNotEmpty()
  password: string;
}
