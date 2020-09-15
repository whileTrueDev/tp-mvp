import {
  IsString, IsNumber, Length
} from 'class-validator';

const userIdMinLength = 6;
const userIdMaxLength = 15;

export class ChangeReadState {
  @IsString()
  @Length(userIdMinLength, userIdMaxLength)
  userId: string;

  @IsNumber()
  index: number;
}
