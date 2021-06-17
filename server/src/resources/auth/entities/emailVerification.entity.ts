import {
  Entity, Column, PrimaryColumn, CreateDateColumn,
} from 'typeorm';

// TODO: interface 생성
@Entity({ name: 'EmailVerificationCode' })
export class EmailVerificationCodeEntity {
  // 3분
  private recentLimitMinute = 3;

  @PrimaryColumn({ comment: '수신 이메일' })
  email: string;

  @Column({ comment: '발송된 인증코드' })
  code: string;

  @CreateDateColumn({ type: 'timestamp', comment: '인증코드 생성시간' })
  createDate: Date;

  // 코드 생성시간과 현재시간 비교하여 몇 분 차이인지 리턴함
  private getMinuiteDiff(): number {
    const now = Date.now();
    const createdTime = new Date(this.createDate).getTime();
    const minuteDiff = Math.floor((now - createdTime) / (60 * 1000));

    return minuteDiff;
  }

  public isSentRecently(): boolean {
    // createDate가 최근 recentLimitMinute분 내인지 확인 -> 코드 재요청시 확인
    return this.getMinuiteDiff() < this.recentLimitMinute;
  }

  public isValidCode(): boolean {
    // createDate가 1시간 이내인지 확인 -> 인증코드 확인에 사용
    return this.getMinuiteDiff() < 60;
  }
}
