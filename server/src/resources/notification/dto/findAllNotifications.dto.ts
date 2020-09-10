import {
  IsString, Length
} from 'class-validator';

const userIdMinLength = 1;
const userIdMaxLength = 20;

export class FindAllNotifications {
  @IsString()
  @Length(userIdMinLength, userIdMaxLength)
  userId: string;
}
