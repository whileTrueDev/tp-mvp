import {
  IsString, Length,
} from 'class-validator';

const userIdMinLength = 4;
const userIdMaxLength = 15;

export class FindAllNotifications {
  @IsString()
  @Length(userIdMinLength, userIdMaxLength)
  userId: string;
}
