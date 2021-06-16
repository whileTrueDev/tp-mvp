import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import crypto from 'crypto';
import { EmailVerificationCodeEntity } from './entities/emailVerification.entity';
@Injectable()
export class EmailVerificationService {
  constructor(
    private readonly mailerService: MailerService,
    @InjectRepository(EmailVerificationCodeEntity)
    private readonly emailCodeRepository: Repository<EmailVerificationCodeEntity>,
  ) {}

  private verificationCodeValidHour = 1;

  // 이메일 인증 위한 6자리 코드 생성
  private createEmailVerificationCode(length = 6): string {
    return crypto.randomBytes(20).toString('hex').slice(0, length);
  }

  // 이메일 인증코드 테이블에 저장
  private async saveVerificationCode({ email, code }: {
    email: string,
     code: string,
  }): Promise<void> {
    try {
      await this.emailCodeRepository.save({ email, code });
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error, 'error in save email verification code');
    }
  }

  // 이메일 인증코드 테이블에서 찾기
  private async findVerificationCode(email: string): Promise<EmailVerificationCodeEntity> {
    return this.emailCodeRepository.findOne({ email });
  }

  // 이메일 주소로 저장된 코드 데이터 삭제하기(회원가입 완료 후)
  async removeCodeEntityByEmail(email: string): Promise<void> {
    const existCode = await this.findVerificationCode(email);
    if (existCode) {
      await this.emailCodeRepository.remove(existCode);
    }
  }

  // 이메일 인증코드 보내기
  async sendVerificationCodeMail(email: string): Promise<any> {
    // 0 테이블에 해당 이메일로 생성된 코드가 있는지 확인
    const existCode = await this.findVerificationCode(email);
    if (existCode) {
      // 이미 존재하고 코드생성시간이 3분이 지나지 않았으면 최근에 보냈음 에러
      if (existCode.isSentRecently()) {
        throw new BadRequestException('이전 코드를 보낸 지 3분이 지나지 않았습니다. 스팸메일함을 확인하거나 3분 후에 다시 시도해주세요.');
      }
      // 이미 존재하고 생성시간이 3분 지났으면 해당 데이터 삭제하고 1로
      await this.emailCodeRepository.remove(existCode);
    }

    // 1. 랜덤 문자열 코드생성
    const code = this.createEmailVerificationCode();
    // 2. 이메일 인증 테이블에 유저 email, 생성된 코드, 생성시간 저장
    await this.saveVerificationCode({ email, code });
    try {
      // 3. 메일로 코드 전송
      await this.mailerService.sendMail({
        to: email, // list of receivers
        from: 'noreply-----truepointceo@gmail.com', // sender address
        subject: '트루포인트 회원가입 인증 코드', // Subject line
        html: `
        <h1>
        트루포인트 회원가입 인증 코드
        </h1>
        <hr />
        <p>인증 코드 : <p/>
        <strong>${code}</strong>
        <br />
        <hr />
        <p>해당 코드를 회원 가입 화면에서 입력해주세요. 
        해당 코드는 ${this.verificationCodeValidHour}시간 동안 유효합니다.</p>
        <p>이 메일을 요청한 적이 없으시다면 무시하시기 바랍니다.</p>
          `, // HTML body content
      });
      return true;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error, `error in send email, address: ${email}`);
    }
  }

  // 인증코드가 유효한지 확인
  async checkVerificationCode(email: string, code: string): Promise<any> {
    try {
      // 이메일 인증 테이블에서 code 찾기
      const codeEntity = await this.findVerificationCode(email);

      // 해당 코드 없거나, 코드가 동일하지 않거나, 유효시간(1시간) 지났거나
      if (!codeEntity || codeEntity.code !== code || !codeEntity.isValidCode()) {
        return { result: false };
      }

      return { result: true };
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error, `error verify code, email address: ${email}`);
    }
  }

  // 이메일로 임시 비밀번호 발급
  async sendTemporaryPassword(email: string, tempPassword: string): Promise<any> {
    try {
      await this.mailerService.sendMail({
        to: email, // list of receivers
        from: 'noreply-----truepointceo@gmail.com', // sender address
        subject: '트루포인트 임시 비밀번호 발급', // Subject line
        html: `
        <h1>
        트루포인트 임시 비밀번호 발급
        </h1>
        <hr />
        <p>임시 비밀번호 : <p/>
        <strong>${tempPassword}</strong>
        <br />
        <hr />
        <p>해당 비밀번호로 로그인 후 비밀번호를 변경해주세요.</p>
          `,
      });
      return true;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error, `error in send temporary password email, address: ${email}`);
    }
  }
}
