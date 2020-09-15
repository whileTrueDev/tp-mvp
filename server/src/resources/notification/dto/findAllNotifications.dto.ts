import {
  IsString, Length
} from 'class-validator';

const userIdMinLength = 6;
const userIdMaxLength = 15;

export class FindAllNotifications {
  @IsString()
  @Length(userIdMinLength, userIdMaxLength)
  userId: string;
}
