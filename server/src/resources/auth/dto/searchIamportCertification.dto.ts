import { IsString } from 'class-validator';

export class CheckCertificationDto {
  @IsString()
  impUid: string;
}
