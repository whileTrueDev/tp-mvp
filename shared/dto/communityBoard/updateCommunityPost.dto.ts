import { IsString, MaxLength } from 'class-validator';

export class UpdateCommunityPostDto {
  @IsString()
  @MaxLength(80)
  title: string;

  @IsString()
  content: string;
}
