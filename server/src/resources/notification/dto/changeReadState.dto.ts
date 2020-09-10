import {
  IsString, IsNumber, Length
} from 'class-validator';

const userIdMinLength = 1;
const userIdMaxLength = 20;

export class ChangeReadState {
  @IsString()
  @Length(userIdMinLength, userIdMaxLength)
  userId: string;

  @IsNumber()
  index: number;
}
