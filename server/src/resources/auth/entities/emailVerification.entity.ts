import {
  Entity, Column, PrimaryColumn,
} from 'typeorm';

// TODO: interface 생성
@Entity({ name: 'EmailVerificationCode' })
export class EmailVerificationCodeEntity {
  private recentLimitMinute = 5;

  @PrimaryColumn({ comment: '수신 이메일' })
  email: string;

  @Column({ comment: '발송된 인증코드' })
  code: string;

  @Column({ type: 'timestamp', comment: '인증코드 생성시간' })
  createDate: Date;

  public isSentRecently(): boolean {
    // this.createDate 반환값이 디비에 저장된 값과 다름...

    // createDate가 최근 5분 내인지 확인 -> 코드 재요청시 확인
    // const now = new Date();
    // const createdTime = dayjs(this.createDate);
    // console.log('now', now);
    // console.log('createTime', createdTime);
    // console.log('timediff', createdTime.diff(now, 'm'));
    // return createdTime.diff(now, 'm') < this.recentLimitMinute;
    return true;
  }

  public isValidCode(): boolean {
    // createDate가 1시간 이내인지 확인 -> 인증코드 확인에 사용
    return true;
  }
}
