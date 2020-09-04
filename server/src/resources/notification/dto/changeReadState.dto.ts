import {
  IsString, IsNumber
} from 'class-validator';

export class ChangeReadState {
  @IsString()
  userId: string;

  @IsNumber()
  index: number;
}
