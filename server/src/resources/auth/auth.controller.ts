import {
  BadRequestException,
  Body,
  Controller,
  Delete, ForbiddenException, Get,
  HttpException, HttpStatus,
  InternalServerErrorException, Post, Query,
  Req, Request,
  Res,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { CheckCertificationDto } from '@truepoint/shared/dist/dto/auth/checkCertification.dto';
import { LogoutDto } from '@truepoint/shared/dist/dto/auth/logout.dto';
import express from 'express';
import { AuthGuard } from '@nestjs/passport';
// import { JwtAuthGuard } from '../../guards/jwt-auth.guard';
// import { LocalAuthGuard } from '../../guards/local-auth.guard';
// import { TwitchLinkGuard } from '../../guards/twitch-link.guard';
// import { YoutubeLinkGuard } from '../../guards/youtube-link.guard';
import { CertificationInfo } from '../../interfaces/certification.interface';
import {
  LogedInExpressRequest, UserLoginPayload,
} from '../../interfaces/logedInUser.interface';
import { ValidationPipe } from '../../pipes/validation.pipe';
import getFrontHost from '../../utils/getFrontHost';
import { PlatformTwitchEntity } from '../users/entities/platformTwitch.entity';
import { PlatformYoutubeEntity } from '../users/entities/platformYoutube.entity';
import { UsersService } from '../users/users.service';
import { AuthService, NaverUserInfo, KakaoUserInfo } from './auth.service';
import { AfreecaLinkExceptionFilter } from './filters/afreeca-link.filter';
import { TwitchLinkExceptionFilter } from './filters/twitch-link.filter';
import { YoutubeLinkExceptionFilter } from './filters/youtube-link.filter';
import { AfreecaLinker } from './strategies/afreeca.linker';
import { EmailVerificationService } from './emailVerification.service';

interface NaverCallbackRequest extends express.Request{
  user: NaverUserInfo;
}
interface kakaoCallbackRequest extends express.Request{
  user: KakaoUserInfo;
}
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly afreecaLinker: AfreecaLinker,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  /**------------------------------------------------------------*/
  // 이메일 본인 인증 코드(회원가입용) 요청
  @Get('email/code')
  async sendVerificationCode(
    @Query('email') email: string,
  ): Promise<any> {
    return this.emailVerificationService.sendVerificationCodeMail(email);
  }

  // 이메일로 받은 본인인증코드 확인
  @Get('email/code/verify')
  async checkVerificationCode(
    @Query('email') email: string,
    @Query('code') code: string,
  ): Promise<any> {
    return this.emailVerificationService.checkVerificationCode(email, code);
  }

  // 이메일로 임시 비밀번호 발급 && 회원 비밀번호를 임시 비밀번호로 수정
  @Get('email/temporary-password')
  async sendTemporaryPassword(
    @Query('email') email: string,
    @Query('id') id: string,
  ): Promise<any> {
    // 임시 비밀번호 생성
    const tempPassword = this.authService.createTempPassword();
    // 이메일로 임시 비밀번호 전송
    const emailSent = await this.emailVerificationService.sendTemporaryPassword(email, tempPassword);

    // 이메일 코드 인증으로 가입한 유저의 userDI는 userId_mail의 형태로 저장하고 있음(RegistStepper.tsx)
    const userDI = `${id}_${email}`;
    // 유저 비밀번호를 임시 비밀번호로 변경하여 저장
    const passwordChanged = await this.usersService.updatePW(userDI, tempPassword);
    return emailSent && passwordChanged;
  }
  /**------------------------------------------------------------*/

  @Post('logout')
  async logout(
    @Body() logoutDto: LogoutDto,
  ): Promise<{ success: boolean }> {
    const isLogoutSucess = await this.authService.logout(logoutDto);
    if (isLogoutSucess) {
      return { success: true };
    }
    return { success: false };
  }

  // 로그인 컨트롤러
  // @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body('stayLogedIn') stayLogedIn: boolean,
    @Request() req: express.Request,
    @Res() res: express.Response,
  ): Promise<void> {
    const user = req.user as UserLoginPayload;
    const {
      accessToken, refreshToken,
    } = await this.authService.login(user, stayLogedIn);

    // *************************************
    // 연동된 플랫폼(아/트/유) 유저 정보 최신화 작업

    // 아프리카의 경우 아직 Profile Data를 제공하지 않아 불가능. 2020.12.08 @by hwasurr
    // if (user.afreeca && user.afreecaId) this.usersService.refreshAfreecaInfo(user.afreecaId);
    if (user.twitch && user.twitch.twitchId) this.usersService.refreshTwitchInfo(user.twitch.twitchId);
    if (user.youtube && user.youtube.youtubeId) this.usersService.refreshYoutubeInfo(user.youtube.youtubeId);

    // Set-Cookie 헤더로 refresh_token을 담은 HTTP Only 쿠키를 클라이언트에 심는다.
    res.cookie('refresh_token', refreshToken, { httpOnly: true });
    res.send({ access_token: accessToken });
  }

  /**
   * 패스워드가 맞는지 확인하여 true , false를 반환하는 컨트롤러로,
   * 보안 인증이 필요한 곳에서 (ex. 비밀번호 변경, 회원탈퇴 등 ) 자신의 비밀번호 확인에 사용됩니다.
   * @param req 로그인 user 정보를 포함한 요청 객체
   * @param password 패스워드 plain 문자열
   */
  // @UseGuards(JwtAuthGuard)
  @Post('check-pw')
  async checkPw(
    @Req() req: LogedInExpressRequest,
    @Body('password') password: string,
  ): Promise<boolean> {
    const result = await this.authService.validateUser(req.user.userId, password);
    if (result) return true;
    throw new ForbiddenException('password incorrect');
  }

  // 토큰 새로고침 컨트롤러
  @Post('silent-refresh')
  async silentRefresh(
    @Request() req: express.Request,
    @Res() res: express.Response,
  ): Promise<void> {
    // 헤더로부터 refresh token 비구조화 할당
    const { refresh_token: prevRefreshToken } = req.cookies;
    if (prevRefreshToken) {
      const {
        accessToken, refreshToken,
      } = await this.authService.silentRefresh(prevRefreshToken);

      // 새로운 HTTP only refreshToken을 쿠키로 설정
      res.cookie('refresh_token', refreshToken, { httpOnly: true });
      // 새로운 accessToken을 반환
      res.send({ access_token: accessToken });
    } else {
      throw new BadRequestException('There is no refresh token in request object');
    }
  }

  @Get('certification')
  async checkCertification(
    @Query(new ValidationPipe()) checkCertificationDto: CheckCertificationDto,
  ): Promise<CertificationInfo> {
    const certificationInfo = await this.authService
      .getCertificationInfo(checkCertificationDto.impUid);
    if (!certificationInfo) throw new HttpException('error on server of truepoint', HttpStatus.BAD_REQUEST);
    return certificationInfo;
  }

  // *******************************************
  // 채널 연동

  /**
   * 트루포인트 유저와 플랫폼 계정을 연동하는 요청 핸들러
   * @param req jwt Guard를 통해 user 정보를 포함한 요청 객체
   * @param platform 연동하는 플랫폼 문자열 twitch|youtube|afreeca 셋 중 하나.
   * @param id 연동하는 플랫폼의 고유 아이디
   */
  @Post('link')
  // @UseGuards(JwtAuthGuard)
  async platformLink(
    @Req() req: LogedInExpressRequest,
    @Body('platform') platform: string, @Body('id') id: string,
  ): Promise<string> {
    const { userId } = req.user;
    return userId;
    // entity 변경으로 제거된 메서드. by hwasurr 210420 -> 연동 기능 필요할 때 새롭게 만드는 것이 더 좋을 듯.
    // return this.usersService.linkUserToPlatform(userId, platform, id);
  }

  /**
   * 트루포인트 유저와 1인미디어 플랫폼 연동을 제거하는 요청 핸들러
   * @param req jwt Guard를 통해 user 정보를 포함한 요청 객체
   * @param platform 연동 제거할 플랫폼 문자열 twitch|youtube|afreeca 셋 중 하나.
   */
  @Delete('link')
  // @UseGuards(JwtAuthGuard)
  async deletePlatformLink(
    @Req() req: LogedInExpressRequest, @Body('platform') platform: string,
  ): Promise<string> {
    const { userId } = req.user;
    const deletedPlatformId = await this.usersService.disconnectLink(userId, platform);

    // 링크 정보 (PlatformTwitch, PlatformYoutube PlatformAfreeca) 삭제
    await this.usersService.deleteLinkUserPlatform(deletedPlatformId, platform);

    return deletedPlatformId;
  }

  // *********** Twitch ******************
  // Twitch Link start
  @Get('twitch')
  // @UseGuards(TwitchLinkGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  twitch(): void {}

  // Twitch oauth Callback url
  @Get('twitch/callback')
  @UseFilters(TwitchLinkExceptionFilter)
  // @UseGuards(TwitchLinkGuard)
  twitchCallback(
    @Req() req: express.Request,
    @Res() res: express.Response,
  ): void {
    const { twitchId } = req.user as PlatformTwitchEntity;
    // settings뒤에 / 꼭 추가. amplify redirect 관련한 일종의 버그 있음.
    // https://github.com/aws-amplify/amplify-console/issues/97
    res.redirect(`${getFrontHost()}/mypage/my-office/settings/?id=${twitchId}&platform=twitch`);
  }

  // *********** Youtube ******************
  // Youtube link start
  @Get('youtube')
  // @UseGuards(YoutubeLinkGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  youtube(): void {}

  @Get('youtube/callback')
  @UseFilters(YoutubeLinkExceptionFilter)
  // @UseGuards(YoutubeLinkGuard)
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  youtubeCallback(
    @Req() req: express.Request,
    @Res() res: express.Response,
  ): void {
    const { youtubeId } = req.user as PlatformYoutubeEntity;
    // settings뒤에 / 꼭 추가. amplify redirect 관련한 일종의 버그 있음.
    // https://github.com/aws-amplify/amplify-console/issues/97
    res.redirect(`${getFrontHost()}/mypage/my-office/settings/?id=${youtubeId}&platform=youtube`);
  }

  // *********** Afreeca ******************
  // creator - afreeca 로그인
  @Get('afreeca')
  @UseFilters(AfreecaLinkExceptionFilter)
  async afreeca(
    @Req() req: express.Request,
    @Res() res: express.Response,
  ): Promise<void> {
    // 현재 userId를 response의 쿠키로 설정
    const userId = req.query.__userId;
    if (!userId) {
      throw new BadRequestException('__userId parameter must be defined');
    }
    res.cookie('__userId', userId);
    // 아프리카 티비로 로그인 - ID/PW 입력창 URL 가져오기
    const afreecaAuthUrl = await this.afreecaLinker.getAfreecaLoginUrl();
    // 아프리카 티비로 로그인으로 redirect
    res.redirect(afreecaAuthUrl);
  }

  // afreeca auth  callback
  @Get('afreeca/callback')
  @UseFilters(AfreecaLinkExceptionFilter)
  async afreecaCallback(
    @Req() req: express.Request,
    @Res() res: express.Response,
  ): Promise<void> {
    const afreecaAuthorizationCode = req.query.code;

    if (!afreecaAuthorizationCode) {
      throw new InternalServerErrorException('can not get authorization code from afreecatv');
    }

    const userId = req.cookies.__userId;

    if (!userId) {
      throw new BadRequestException('__userId parameter must be defined');
    }

    // get refresh and accessToken
    const {
      // accessToken,
      refreshToken,
    } = await this.afreecaLinker.getTokens(afreecaAuthorizationCode as string);

    // link with truepoint user
    // by hwasurr, 2020.12.08 아직 아프리카 open API에서는 유저 프로필을 제공하지 않아 실제 유저 아이디를 조회할 수 없음 -> 향후 업데이트 필요.
    // 현재는 트루포인트 userID를 넣는다.
    await this.afreecaLinker.link(refreshToken, userId)
      .then(() => {
        // settings뒤에 / 꼭 추가. amplify redirect 관련한 일종의 버그 있음.
        // https://github.com/aws-amplify/amplify-console/issues/97

        // by hwasurr, 2020.12.08 아직 아프리카 open API에서는 유저 프로필을 제공하지 않아 실제 유저 아이디를 조회할 수 없음 -> 향후 업데이트 필요.
        // 실제 아프리카 유저 아이디를 들고올 수 있을 때, id, platform 쿼리스트링 추가
        res.redirect(`${getFrontHost()}/mypage/my-office/settings/`); // ?id=${afreecaId}&platform=afreeca
      })
      .catch((err) => {
        throw new Error(`${err.message}&platform=afreeca`);
      });
  }

  // *********** naver ******************
  // 네이버 로그인
  @Get('naver')
  @UseGuards(AuthGuard('naver'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  naver(): void {}

  @Get('naver/callback')
  @UseGuards(AuthGuard('naver'))
  async naverCallback(
    @Req() req: NaverCallbackRequest,
    @Res() res: express.Response,
  ): Promise<any> {
    const { user } = req;
    const {
      // user: userLoggedIn, 
      // accessToken, 
      refreshToken,
    } = await this.authService.naverLogin(user);

    res.cookie('refresh_token', refreshToken, { httpOnly: true });
    res.redirect(`${getFrontHost()}/mypage/main`);
  }

  // *********** kakao ******************
  // 카카오 로그인
  @Get('kakao')
  @UseGuards(AuthGuard('kakao'))
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  kakao(): void {}

  @Get('kakao/callback')
  @UseGuards(AuthGuard('kakao'))
  async kakaoCallback(
    @Req() req: kakaoCallbackRequest,
    @Res() res: express.Response,
  ): Promise<void> {
    const { user } = req;
    const {
      refreshToken,
    } = await this.authService.kakaoLogin(user);

    res.cookie('refresh_token', refreshToken, { httpOnly: true });
    res.redirect(`${getFrontHost()}/mypage/main`);
  }

  // admin page 로그인
  @Post('adminLogin')
  adminLogin(
    @Body('userId') userId: string,
    @Body('password') password: string,
  ): Promise<boolean> {
    return this.authService.validateAdmin(userId, password);
  }
}
