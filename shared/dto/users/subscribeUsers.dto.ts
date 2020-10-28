import {
  IsNotEmpty, IsString, MaxLength, MinLength,
} from 'class-validator';

export class SubscribeUsers {
  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(20)
  userId: string;
}
