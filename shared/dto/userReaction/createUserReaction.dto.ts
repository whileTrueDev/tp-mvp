import { IsString, MaxLength } from 'class-validator';

export class CreateUserReactionDto {
  @IsString()
  username: string;

  @IsString()
  @MaxLength(50)
  content: string;
}
