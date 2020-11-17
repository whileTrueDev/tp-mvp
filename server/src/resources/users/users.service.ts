import bcrypt from 'bcrypt';
import {
  Injectable, HttpException, HttpStatus, BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from '@truepoint/shared/dist/dto/users/updateUser.dto';
import { ProfileImages } from '@truepoint/shared/dist/res/ProfileImages.interface';
import { UserEntity } from './entities/user.entity';
import { UserTokenEntity } from './entities/userToken.entity';
import { SubscribeEntity } from './entities/subscribe.entity';
import { PlatformTwitchEntity } from './entities/platformTwitch.entity';
import { PlatformAfreecaEntity } from './entities/platformAfreeca.entity';
import { PlatformYoutubeEntity } from './entities/platformYoutube.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(UserTokenEntity)
    private readonly userTokensRepository: Repository<UserTokenEntity>,
    @InjectRepository(SubscribeEntity)
    private readonly subscribeRepository: Repository<SubscribeEntity>,
    @InjectRepository(PlatformTwitchEntity)
    private readonly twitchRepository: Repository<PlatformTwitchEntity>,
    @InjectRepository(PlatformAfreecaEntity)
    private readonly afreecaRepository: Repository<PlatformAfreecaEntity>,
    @InjectRepository(PlatformYoutubeEntity)
    private readonly youtubeRepository: Repository<PlatformYoutubeEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  async findOne(userId: string): Promise<UserEntity> {
    const user = await this.usersRepository.findOne(userId);
    return user;
  }

  async findSubscriberInfo(userId: string): Promise<Pick<UserEntity, 'nickName' | 'afreecaId' | 'youtubeId' | 'twitchId'>> {
    return this.usersRepository.findOne(userId, {
      select: ['nickName', 'afreecaId', 'youtubeId', 'twitchId'],
    });
  }

  async findOneProfileImage(userId: string): Promise<ProfileImages> {
    const user = await this.usersRepository.findOne(userId);
    const images = [];

    // const afreecaLink = await this.afreecaRepository.findOne(user.afreecaId);
    // if (afreecaLink) images.push({ platform: 'afreeca', logo: afreecaLink.logo });

    const twitchLink = await this.twitchRepository.findOne(user.twitchId);
    if (twitchLink) images.push({ platform: 'twitch', logo: twitchLink.logo });

    const youtubeLink = await this.youtubeRepository.findOne(user.youtubeId);
    if (youtubeLink) {
      images.push(
        { platform: 'youtube', logo: youtubeLink.youtubeLogo.replace('{size}', '150') },
      );
    }
    return images;
  }

  async updateOne(dto: UpdateUserDto): Promise<any> {
    return this.usersRepository.save({
      userId: dto.userId,
      gender: dto.gender,
      mail: dto.mail,
      nickName: dto.nickName,
      profileImage: dto.profileImage,
    });
  }

  async remove(userid: string): Promise<void> {
    await this.usersRepository.delete(userid);
  }

  async register(user: UserEntity): Promise<UserEntity> {
    // 비밀번호 암호화 using bcrypt
    // Github Repository => https://github.com/kelektiv/node.bcrypt.js/
    const hashedPassword = await bcrypt.hash(user.password, 10);

    return this.usersRepository.save({ ...user, password: hashedPassword });

    // throw new HttpException('ID is duplicated', HttpStatus.BAD_REQUEST);
  }

  // User의 ID를 찾는 동기 함수. 결과값으로는 UserEntity의 인스턴스를 반환받되, 전달하는 것은 ID이다.
  // ID가 존재하지 않으면, ID에 대한 값을 null으로 전달한다.
  async findID(name: string, mail?: string, userDI?: string): Promise<Pick<UserEntity, 'userId'>> {
    // userDI의 존재여부에 따라서 조회방식을 분기한다.
    try {
      if (userDI) {
        const user = await this.usersRepository
          .findOne({ where: { userDI } });
        if (user) {
          return { userId: user.userId };
        }
        return { userId: null };
      }
      const user = await this.usersRepository
        .findOne({ where: { name, mail } });
      if (user) {
        return { userId: user.userId };
      }
      return { userId: null };
    } catch {
      throw new HttpException('ID is not found', HttpStatus.BAD_REQUEST);
    }
  }

  async checkID({ userId, userDI }: { userId?: string; userDI?: string }): Promise<boolean> {
    const user = await this.usersRepository
      .findOne({ where: (userDI ? { userDI } : { userId }) });
    if (user) {
      return true;
    }
    return false;
  }

  // 본인인증의 결과가 인증이 되면,  해당 계정의 패스워드를 변경한다.
  async updatePW(userDI: string, password: string): Promise<boolean> {
    try {
      const user = await this.usersRepository
        .findOne({ where: { userDI } });
      if (user) {
        const hashedPassword = await bcrypt.hash(password, 10);

        await this.usersRepository
          .createQueryBuilder()
          .update(user)
          .set({
            password: hashedPassword,
          })
          .where('userDI = :userDI', { userDI })
          .execute();
        return true;
      }
      return false;
    } catch {
      throw new HttpException('updatePW error', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  /*
    input   : userId (로그인한 유저 아이디) 
    output  : [{userId, subscribeperiod}, {userId, subscribeperiod} ... ]
    해당 유저가 구독한 유저 정보 리스트 {userId, subscribeperiod}
  */
  async findUserSubscribeInfo(
    userId: string,
  ): Promise<{validUserList: SubscribeEntity[]; inValidUserList: SubscribeEntity[]}> {
    const validUserList = await this.subscribeRepository
      .createQueryBuilder('subscribe')
      .where('subscribe.userId = :id', { id: userId })
      .andWhere('subscribe.startAt <= NOW()')
      .andWhere('subscribe.endAt >= NOW()')
      .getMany();

    const inValidUserList = await this.subscribeRepository
      .createQueryBuilder('subscribe')
      .where('subscribe.userId = :id', { id: userId })
      .andWhere('subscribe.startAt > NOW() OR subscribe.endAt < NOW()')
      .getMany();

    return { validUserList, inValidUserList };
  }

  /*
    input   : userId (로그인한 유저 아이디) ,targetUserId (분석 요청할 유저 아이디)
    output  : true | false
  */
  async checkSubscribeValidation(userId: string, targetId: string): Promise<boolean> {
    const subscribeResult = await this.subscribeRepository
      .createQueryBuilder('subscribe')
      .where('subscribe.userId = :userId', { userId })
      .andWhere('subscribe.targetUserId = :targetId', { targetId })
      .andWhere('subscribe.startAt <= NOW()')
      .andWhere('subscribe.endAt >= NOW()')
      .getOne();

    if (subscribeResult) {
      return true;
    }

    return false;
  }

  /*
    관리자 페이지 개인 알림 보낼 유저 리스트 조회
    input   : empty
    output  : [ userId1, userId2, ... ]
  */
  async findAllUserList(): Promise<{userId: string}[]> {
    const allUserId = await this.usersRepository
      .createQueryBuilder('users')
      .select(['userId'])
      .execute();

    return allUserId;
  }

  // **********************************************
  // User Tokens 관련

  // Find User Tokens
  async findOneToken(refreshToken: string): Promise<UserTokenEntity> {
    const userToken = await this.userTokensRepository.findOne({
      refreshToken,
    });

    return userToken;
  }

  // Refresh Token 삭제 - 로그아웃을 위해
  async removeOneToken(userId: string): Promise<UserTokenEntity> {
    const userToken = await this.userTokensRepository.findOne(userId);
    return this.userTokensRepository.remove(userToken);
  }

  // Update User Tokens
  async saveRefreshToken(
    newTokenEntity: UserTokenEntity,
  ): Promise<UserTokenEntity> {
    return this.userTokensRepository.save(newTokenEntity);
  }

  // ***********************************************
  // 플랫폼 연동 관련

  async linkUserToPlatform(
    userId: string, platform: string, platformId: string,
  ): Promise<UserEntity | null> {
    // 적재된 연동 데이터의 실제 트루포인트 유저 정보에 추가
    // 어느 트루포인트 유저가 트위치 연동을 진행했는 지 곧바로 알 수 없음..
    // twitch accesstoken 발급 이후 프론트로 리다이렉트할 때 방금 유저의 고유 id와 플랫폼 정보를 전달하고,
    // 그 정보를 다시 백엔드에서 받아와 올바르 유저에 맞게 적재하는 방식.
    // 현재 이 메서드는 백엔드에서 받아와 올바르 유저에 맞게 적재하는 작업을 진행.
    const targetUser = await this.usersRepository.findOne(userId);

    // 현재 받아온 platformId가 연동된 플랫폼 정보가 있는지 체크 작업 필요
    // platformTwitch, platformYoutube, platformAfreeca 등을 체크한 후 있으면 그 때 넣도록 처리.
    switch (platform) {
      case 'twitch': {
        const linkedInfo = await this.twitchRepository.findOne(platformId);
        if (linkedInfo) targetUser[`${platform}Id`] = platformId;
        break;
      }
      case 'youtube': {
        const linkedInfo = await this.youtubeRepository.findOne(platformId);
        if (linkedInfo) targetUser[`${platform}Id`] = platformId;
        break;
      }
      case 'afreeca': {
        const linkedInfo = await this.afreecaRepository.findOne(platformId);
        if (linkedInfo) targetUser[`${platform}Id`] = platformId;
        break;
      }
      default: throw new BadRequestException('platform must be one of "twitch" | "afreeca" | "youtube"');
    }
    return this.usersRepository.save(targetUser);
  }

  /**
   * 연결된 플랫폼 정보(twitch, youtube, afreeca 고유 ID 데이터)를 삭제하는 메소드 
   * @param {string} userId 연결된 플랫폼 정보를 삭제할 트루포인트 유저 아이디 문자열
   * @param {string} platform 삭제할 연결된 플랫폼 문자열
   */
  async deleteLinkUserPlatform(
    userId: string, platform: string,
  ): Promise<number> {
    let result: number;
    const targetUser = await this.usersRepository.findOne(userId);
    if (platform === 'twitch') {
      result = (await this.twitchRepository.delete(targetUser.twitchId)).affected;
    }
    if (platform === 'afreeca') {
      result = (await this.afreecaRepository.delete(targetUser.afreecaId)).affected;
    }
    if (platform === 'youtube') {
      result = (await this.youtubeRepository.delete(targetUser.youtubeId)).affected;
    }

    return result;
  }

  /**
   * 연결된 트루포인트 Users 에서 플랫폼 연결 link를 삭제하는 메소드
   * 부가적으로, 대표 프로필 사진이 삭제하고자하는 플랫폼으로 설정되어 있는 경우 대표 프로필 사진을 삭제합니다.
   * @param {string} userId 트루포인트 유저 아이디 문자열
   * @param {string} platform 연결된 플랫폼 문자열
   */
  async disconnectLink(
    userId: string, platform: string,
  ): Promise<number> {
    const targetUser = await this.usersRepository.findOne(userId);
    let targetPlatformLogo: string;
    if (platform === 'afreeca') {
      const afreeca = await this.twitchRepository.findOne(targetUser.afreecaId);
      targetPlatformLogo = afreeca.logo;
    }
    if (platform === 'twitch') {
      const twitch = await this.twitchRepository.findOne(targetUser.twitchId);
      targetPlatformLogo = twitch.logo;
    }
    if (platform === 'youtube') {
      const youtube = await this.youtubeRepository.findOne(targetUser.youtubeId);
      targetPlatformLogo = youtube.youtubeLogo;
    }

    // 플랫폼 연결 정보 삭제 및 대표 프로필 사진이 해당 플랫폼의 프로필사진인 경우 함께 삭제
    const result = await this.usersRepository.update(
      userId, {
        [`${platform}Id`]: undefined,
        profileImage: targetPlatformLogo === targetUser.profileImage ? undefined : targetUser.profileImage,
      },
    );
    return result.affected;
  }

  // ****************** 트위치 *******************
  // 트위치 연동 데이터 적재 ( PlatformTwitch 테이블 )
  async linkTwitch(data: PlatformTwitchEntity): Promise<PlatformTwitchEntity> {
    const alreadyLinked = await this.twitchRepository.findOne(data.twitchId);
    if (alreadyLinked) {
      // 이미 해당 twitch 유저와 연동된 아이디가 있는 경우 "업데이트"
      this.twitchRepository.update([
        'twitchStreamerName', 'twitchChannelName', 'logo', 'refreshToken',
      ], data);
      return data;
    }
    return this.twitchRepository.save(data);
  }

  // ****************** 유튜브 *******************
  // 트위치 연동 데이터 적재 ( PlatformTwitch 테이블 )
  async linkYoutube(data: PlatformYoutubeEntity): Promise<PlatformYoutubeEntity> {
    const alreadyLinked = await this.youtubeRepository.findOne({
      googleId: data.googleId, youtubeId: data.youtubeId,
    });
    if (alreadyLinked) {
      // 이미 해당 youtube 유저와 연동된 아이디가 있는 경우 "업데이트"

    }
    return this.youtubeRepository.save(data);
  }

  // ****************** 유튜브 *******************
  // 트위치 연동 데이터 적재 ( PlatformTwitch 테이블 )
  async linkAfreeca(data: PlatformAfreecaEntity): Promise<PlatformAfreecaEntity> {
    const alreadyLinked = await this.afreecaRepository.findOne(data.afreecaId);
    if (alreadyLinked) {
      // 이미 해당 youtube 유저와 연동된 아이디가 있는 경우 "업데이트"

    }
    return this.afreecaRepository.save(data);
  }
}
