import {
  BadRequestException,
  forwardRef, HttpException, HttpStatus,
  Inject, Injectable, InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { RegisterUserByAdminDto } from '@truepoint/shared/dist/dto/users/registerUserByAdminDto.dto';
import { UpdateUserDto } from '@truepoint/shared/dist/dto/users/updateUser.dto';
import { BriefInfoDataResType } from '@truepoint/shared/dist/res/BriefInfoData.interface';
import { ChannelNames } from '@truepoint/shared/dist/res/ChannelNames.interface';
import { EditingPointListResType } from '@truepoint/shared/dist/res/EditingPointListResType.interface';
import { ProfileImages } from '@truepoint/shared/dist/res/ProfileImages.interface';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import Axios from 'axios';
import bcrypt from 'bcrypt';
import { getConnection, Repository } from 'typeorm';
import { AfreecaActiveStreamsEntity } from '../../collector-entities/afreeca/activeStreams.entity';
import { AfreecaTargetStreamersEntity } from '../../collector-entities/afreeca/targetStreamers.entity';
import { TwitchTargetStreamersEntity } from '../../collector-entities/twitch/targetStreamers.entity';
import { YoutubeTargetStreamersEntity } from '../../collector-entities/youtube/targetStreamers.entity';
import { TwitchProfileResponse } from '../auth/interfaces/twitchProfile.interface';
import { AfreecaLinker } from '../auth/strategies/afreeca.linker';
import { S3Service } from '../s3/s3.service';
import { StreamsEntity } from '../stream-analysis/entities/streams.entity';
import { PlatformAfreecaEntity } from './entities/platformAfreeca.entity';
import { PlatformTwitchEntity } from './entities/platformTwitch.entity';
import { PlatformYoutubeEntity } from './entities/platformYoutube.entity';
import { SubscribeEntity } from './entities/subscribe.entity';
import { UserEntity } from './entities/user.entity';
import { UserTokenEntity } from './entities/userToken.entity';
import { UserDetailEntity } from './entities/userDetail.entity';
import { EmailVerificationService } from '../auth/emailVerification.service';
@Injectable()
export class UsersService {
  // eslint-disable-next-line max-params
  constructor(
    private readonly configService: ConfigService,
    private readonly s3Service: S3Service,
    @Inject(forwardRef(() => AfreecaLinker))
    private readonly afreecaLinker: AfreecaLinker,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(UserDetailEntity)
    private readonly userDetailRepo: Repository<UserDetailEntity>,
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
    @InjectRepository(TwitchTargetStreamersEntity, 'WhileTrueCollectorDB')
    private readonly twitchTargetStreamersRepository: Repository<TwitchTargetStreamersEntity>,
    @InjectRepository(AfreecaTargetStreamersEntity, 'WhileTrueCollectorDB')
    private readonly afreecaTargetStreamersRepository: Repository<AfreecaTargetStreamersEntity>,
    @InjectRepository(AfreecaActiveStreamsEntity, 'WhileTrueCollectorDB')
    private readonly afreecaActiveStreamsRepository: Repository<AfreecaActiveStreamsEntity>,
    @InjectRepository(YoutubeTargetStreamersEntity, 'WhileTrueCollectorDB')
    private readonly youtubeTargetStreamersRepository: Repository<YoutubeTargetStreamersEntity>,
    @InjectRepository(StreamsEntity)
    private readonly streamsRepository: Repository<StreamsEntity>,
    private readonly emailVerificationService: EmailVerificationService,
  ) {}

  private resizeingYoutubeLogo(youtubeLogoString: string): string {
    return youtubeLogoString.replace('{size}', '150');
  }

  async findAll(): Promise<UserEntity[]> {
    return this.usersRepository.find();
  }

  async findOne({ userId, creatorId }: {userId?: string; creatorId?: string}): Promise<UserEntity> {
    if (creatorId) {
      const user = await this.usersRepository.findOne({
        where: [
          { afreeca: creatorId },
          { twitch: creatorId },
        ],
        order: { createdAt: 'DESC' },
        relations: ['twitch', 'afreeca', 'youtube', 'afreeca.categories', 'twitch.categories', 'detail'],
      });
      return user;
    }
    if (userId) {
      const user = await this.usersRepository.findOne(userId, {
        order: { createdAt: 'DESC' },
        relations: ['twitch', 'afreeca', 'youtube', 'afreeca.categories', 'twitch.categories', 'detail'],
      });
      return user;
    }
    throw new BadRequestException('userId or creatorId parameter is required');
  }

  /**
   * 특정 유저의 연동된 플랫폼의 프로필 이미지 정보를 반환하는 메서드
   * @param userId 프로필 이미지 정보를 열람하고자 하는 유저 아이디
   */
  async findOneProfileImage(userId: string): Promise<ProfileImages> {
    const user = await this.usersRepository.findOne(userId, {
      relations: ['twitch', 'afreeca', 'youtube'],
    });
    const images = [];

    // 아프리카는 OPEN API 업데이트 이후 추가 20.11.18 hwasurr
    if (user.afreeca) {
      images.push({ platform: 'afreeca', logo: user.afreeca.logo });
    }
    if (user.twitch) {
      images.push({ platform: 'twitch', logo: user.twitch.logo });
    }
    if (user.youtube) {
      images.push(
        { platform: 'youtube', logo: this.resizeingYoutubeLogo(user.youtube.youtubeLogo) },
      );
    }
    return images;
  }

  async findChannelNames(userId: string): Promise<ChannelNames> {
    const user = await this.usersRepository.findOne(userId);
    const nickNames: ChannelNames = [];

    // 아프리카는 OPEN API 업데이트 이후 추가 20.11.18 hwasurr
    // const afreecaLink = await this.afreecaRepository.findOne(user.afreecaId);
    // if (afreecaLink) images.push({ platform: 'afreeca', logo: afreecaLink.logo });

    if (user.twitch) {
      nickNames.push({ platform: 'twitch', nickName: user.twitch.twitchChannelName });
    }

    if (user.youtube) {
      nickNames.push(
        { platform: 'youtube', nickName: user.youtube.youtubeTitle },
      );
    }
    return nickNames;
  }

  async updateOne(dto: UpdateUserDto): Promise<any> {
    // const user = await this.usersRepository.findOne(dto.userId);
    const detail = this.userDetailRepo.create({
      id: dto.detailId,
      description: dto.description,
      youtubeChannelAddress: dto.youtubeChannelAddress,
    });

    if (dto.heroImageLight) {
      const heroImageUrl = await this.s3Service.uploadBase64ImageToS3(
        `heroImage/${dto.userId}/light`, dto.heroImageLight,
      );
      detail.heroImageLight = heroImageUrl;
    }
    if (dto.heroImageDark) {
      const heroImageUrl = await this.s3Service.uploadBase64ImageToS3(
        `heroImage/${dto.userId}/dark`, dto.heroImageDark,
      );
      detail.heroImageDark = heroImageUrl;
    }
    await this.userDetailRepo.save(detail);

    const user = this.usersRepository.create({
      userId: dto.userId,
      gender: dto.gender,
      mail: dto.mail,
      nickName: dto.nickName,
      profileImage: dto.profileImage,
      detail,
    });

    return this.usersRepository.save(user);
  }

  /**
   * 유저 정보 삭제 메서드 userId를 제외한 모든 column을 없앱니다.
   * @param userId 삭제할 유저 고유 아이디
   */
  async remove(userId: string): Promise<number> {
    const targetUser = await this.usersRepository.findOne(userId);
    const result = await this.usersRepository.update(userId, {
      name: '',
      mail: '',
      nickName: '',
      userDI: `DELETED_${targetUser.userDI}`,
      profileImage: '',
      afreeca: null,
      youtube: null,
      twitch: null,
      password: '',
      birth: '',
      gender: '',
      marketingAgreement: false,
      phone: '',
    });
    return result.affected;
  }

  /**
   * 유저를 생성합니다. (회원가입)
   * @param user 유저 생성 엔터티
   * @returns UserEntity
   */
  async register(user: UserEntity): Promise<UserEntity> {
    // 비밀번호 암호화 using bcrypt
    // Github Repository => https://github.com/kelektiv/node.bcrypt.js/
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await this.emailVerificationService.removeCodeEntityByEmail(user.mail);
    return this.usersRepository.save({ ...user, password: hashedPassword });

    // throw new HttpException('ID is duplicated', HttpStatus.BAD_REQUEST);
  }

  async registerByAdmin(dto: RegisterUserByAdminDto): Promise<void> {
    // const hashedPassword = await bcrypt.hash(dto.password, 10);

    const createuser: User = {
      userId: dto.userId,
      userDI: `${dto.userId}_${dto.platform}_${new Date().getTime()}`,
      nickName: dto.nickname,
      name: dto.nickname,
      mail: '',
      phone: '',
      password: '$2b$10$4wceyfuHBgJj8gA/dWDCleQObCqNa0qPaQSWfoMrQJkKB3O4uNhP2', // hashedPassword, // 기본 비밀번호 ??????? slack에서 확인.
      roles: 'user',
      birth: '',
      gender: '',
      marketingAgreement: false,
    };

    // 유저가 아프리카인 경우 AfreecaId admin 서버로 부터 받은 아프리카 아이디를 넣어준다. ex.) arinbbidol
    if (dto.platform === 'afreeca' && dto.platformId) {
      // CollectorDB -> AfreecaTargetStreamers
      await getConnection().transaction(async (em) => {
        // PlatformAfreeca 추가
        // $2b$10$bcinT2JlNju0PkCMnqxu7eah/29TePs2jjNVixneaWo09tIXr073q
        const afreeca = this.afreecaRepository.create({
          afreecaId: dto.platformId,
          afreecaStreamerName: dto.nickname,
          logo: dto.logo,
          refreshToken: `향후실제리프레시토큰으로변경필요_CREATED_BY_ADMIN_${dto.platformId}`,
        });
        await em.save(PlatformAfreecaEntity, afreeca);
        await em.save(UserEntity, { ...createuser, afreeca });
      });
      await this.addAfreecaTargetStreamer({
        creatorId: dto.platformId,
        creatorName: dto.nickname,
      });
    }

    if (dto.platform === 'twitch' && dto.platformId) {
      // CollectorDB -> AfreecaTargetStreamers
      await getConnection().transaction(async (em) => {
        // PlatformTwitch 추가
        const twitch = this.twitchRepository.create({
          twitchId: dto.twitchCreatorId,
          logo: dto.logo,
          twitchStreamerName: dto.nickname,
          twitchChannelName: dto.platformId,
          refreshToken: `향후실제리프레시토큰으로변경필요_CREATED_BY_ADMIN_${dto.platformId}`,
        });
        await em.save(PlatformTwitchEntity, twitch);
        await em.save(UserEntity, { ...createuser, twitch });
      });

      await this.addTwitchTargetStreamer({
        streamerChannelName: dto.platformId,
        streamerName: dto.nickname,
        streamerId: dto.twitchCreatorId,
      });
    }
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

  async checkEmail(email: string): Promise<boolean> {
    const user = await this.usersRepository.findOne({ where: { mail: email } });
    if (user) return true;
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
  async findAllUserList(): Promise<UserEntity[]> {
    const allUsers = await this.usersRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['twitch', 'afreeca', 'youtube', 'afreeca.categories', 'twitch.categories', 'detail'],
    });
    return allUsers;
  }

  /**
   * 관리자 페이지 - 이용자db 정보 조회 탭에서 사용
   * input : empty
   * output : [{nickName, userId, recentBroadcastDate, averageViewer}...]
   *              이용자 닉네임, 아이디, 최근방송날짜, 평균시청자 조회
   */
  async getAllUserBriefInfoList(): Promise<BriefInfoDataResType> {
    const result = await this.usersRepository.createQueryBuilder('users')
      .leftJoinAndSelect(StreamsEntity, 'streams', 'streams.userId = users.userId')
      .select([
        'users.userId AS userId',
        'users.nickName AS nickName',
        'AVG(streams.viewer) AS averageViewer',
        'MAX(streams.endDate) AS recentBroadcastDate',
      ])
      .groupBy('users.userId')
      .orderBy('MAX(streams.endDate)', 'DESC')
      .getRawMany();
    return result;
  }

  /**
   * 유투브 편집점 페이지 편집점 제공 목록
   * 해당 플랫폼에서 크리에이터당 최신 방송날짜를 가져온다
   * @param platform 'afreeca' | 'twitch'
   * 
   * @return EditingPointListResType[]
   * {   
   *  creatorId: string, // 크리에이터 ID
      platform: string, // 플랫폼 'afreeca' | 'twitch'
      userId: string,   // userId
      title: string,   // 가장 최근 방송 제목
      endDate: Date,   // 가장 최근 방송의 종료시간
      nickname: string // 크리에이터 활동명
      logo: string // 크리에이터 로고
   * }[]
   */
  async getHighlightPointList(platform: 'afreeca'|'twitch'): Promise<EditingPointListResType[]> {
    try {
      const matchingId = `${platform}Id`;
      const dataWithoutProfileImage = await this.streamsRepository.createQueryBuilder('streams')
        .leftJoinAndSelect(UserEntity, 'users', `streams.creatorId = users.${matchingId}`)
        .select([
          'streams.creatorId AS creatorId',
          'streams.platform AS platform',
          'streams.title AS title',
          'MAX(streams.endDate) AS endDate',
          'users.userId AS userId',
          'users.nickName AS nickname',
        ])
        .where('streams.platform = :platform', { platform })
        .groupBy('streams.creatorId')
        .orderBy('MAX(streams.endDate)', 'DESC')
        .getRawMany();

      const userHighlightData = Promise.all(dataWithoutProfileImage.map(async (row) => {
        const getUserProfileImage = await this.findOneProfileImage(row.userId);
        return { ...row, logo: getUserProfileImage[0].logo };
      }));
      return userHighlightData;
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException('Error in getEditingPointList');
    }
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
    if (!userToken) {
      throw new InternalServerErrorException('userToken waht you request to logout is not exists');
    }
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
  /**
   * 연결된 플랫폼 정보(twitch, youtube, afreeca 고유 ID 데이터)를 삭제하는 메소드 
   * @param {string} userId 삭제할 타겟의 플랫폼 고유 아이디
   * @param {string} platform 삭제할 연결된 플랫폼 문자열
   */
  async deleteLinkUserPlatform(
    deleteTargetId: string, platform: string,
  ): Promise<number | PlatformTwitchEntity | PlatformAfreecaEntity | PlatformYoutubeEntity> {
    if (platform === 'twitch') {
      const target = await this.twitchRepository.findOne(deleteTargetId);
      if (target) {
        return this.twitchRepository.remove(target);
      }
    }
    if (platform === 'afreeca') {
      const target = await this.afreecaRepository.findOne(deleteTargetId);
      if (target) {
        return this.afreecaRepository.remove(target);
      }
    }
    if (platform === 'youtube') {
      const target = await this.youtubeRepository.findOne(deleteTargetId);
      if (target) {
        return this.youtubeRepository.remove(target);
      }
    }
    return 1;
  }

  /**
   * 연결된 트루포인트 Users 에서 플랫폼 연결 link를 삭제하는 메소드
   * 부가적으로, 대표 프로필 사진이 삭제하고자하는 플랫폼으로 설정되어 있는 경우 대표 프로필 사진을 삭제합니다.
   * @param {string} userId 트루포인트 유저 아이디 문자열
   * @param {string} platform 연결된 플랫폼 문자열
   */
  async disconnectLink(
    userId: string, platform: string,
  ): Promise<string> {
    const targetUser = await this.usersRepository.findOne(userId);
    let deletedPlatformId: string;
    let targetPlatformLogo: string;
    let targetPlatformNickname: string;
    // 아프리카의 경우 아직 채널/유저 프로필사진 데이터를 가져올 수 없다.
    if (platform === 'afreeca') {
      deletedPlatformId = targetUser.afreeca.afreecaId;
      // ************************************************
      // CollectorDB Target Streamer에서 제거
      const targetUserOnCollector = await this.afreecaTargetStreamersRepository.findOne(deletedPlatformId);
      if (targetUserOnCollector) this.afreecaTargetStreamersRepository.remove(targetUserOnCollector);

      // CollectorDB ActiveStreams 에서 제거
      const targetActiveStreamOnCollector = await this.afreecaActiveStreamsRepository.findOne({
        creatorId: deletedPlatformId,
      });
      if (targetActiveStreamOnCollector) this.afreecaActiveStreamsRepository.remove(targetActiveStreamOnCollector);

      // 선택된 로고 + 닉네임 제거
      targetPlatformLogo = targetUser.afreeca.logo;
      targetPlatformNickname = targetUser.afreeca.afreecaStreamerName;
    }
    if (platform === 'twitch') {
      deletedPlatformId = targetUser.twitch.twitchId;
      // ************************************************
      // CollectorDB Target Streamer에서 제거
      const targetUserOnCollector = await this.twitchTargetStreamersRepository.findOne(deletedPlatformId);
      if (targetUserOnCollector) this.twitchTargetStreamersRepository.remove(targetUserOnCollector);

      // 선택된 로고 + 닉네임 제거
      targetPlatformLogo = targetUser.twitch.logo;
      targetPlatformNickname = targetUser.twitch.twitchChannelName;
    }
    if (platform === 'youtube') {
      deletedPlatformId = targetUser.youtube.youtubeId;
      // ************************************************
      // CollectorDB Target Streamer에서 제거
      const targetUserOnCollector = await this.youtubeTargetStreamersRepository.findOne(deletedPlatformId);
      if (targetUserOnCollector) this.youtubeTargetStreamersRepository.remove(targetUserOnCollector);

      // 선택된 로고 + 닉네임 제거
      targetPlatformLogo = this.resizeingYoutubeLogo(targetUser.youtube.youtubeLogo);
      targetPlatformNickname = targetUser.youtube.youtubeTitle;
    }

    // 플랫폼 연결 정보 삭제 및 대표 프로필 사진|닉네임이 해당 플랫폼의 프로필사진|닉네임인 경우 함께 삭제
    await this.usersRepository.update(
      userId, {
        [platform]: null,
        profileImage: targetPlatformLogo === targetUser.profileImage ? undefined : targetUser.profileImage,
        nickName: targetPlatformNickname === targetUser.nickName ? undefined : targetUser.nickName,
      },
    );
    return deletedPlatformId;
  }

  // ****************** 트위치 *******************
  // 트위치 연동 데이터 적재 ( PlatformTwitch 테이블 )
  /**
   * 트위치 연동 정보를 DB에 삽입합니다. 이미 연동 정보가 존재하면 업데이트합니다.
   * @param {PlatformTwitchEntity} data 트위치 연동 정보 Entity
   */
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
  // 유튜부 연동 데이터 적재 ( PlatformYoutube 테이블 )
  /**
   * 유튜브 연동 정보를 DB에 삽입합니다. 이미 연동 정보가 존재하면 업데이트합니다.
   * @param {PlatformYoutubeEntity} data 유튜브 연동 정보 Entity
   */
  async linkYoutube(data: PlatformYoutubeEntity): Promise<PlatformYoutubeEntity> {
    const alreadyLinked = await this.youtubeRepository.findOne({
      googleId: data.googleId, youtubeId: data.youtubeId,
    });
    if (alreadyLinked) {
      // 이미 해당 youtube 유저와 연동된 아이디가 있는 경우 "업데이트"
      this.youtubeRepository.update([
        'googleId', 'googleName', 'googleEmail', 'refreshToken',
        'googleLogo', 'youtubeId', 'youtubeTitle', 'youtubeLogo',
      ], data);
    }
    return this.youtubeRepository.save(data);
  }

  // ****************** 아프리카 *******************
  // 아프리카 연동 데이터 적재 ( PlatformAfreeca 테이블 )
  /**
   * 아프리카 연동 정보를 DB에 삽입합니다. 이미 연동 정보가 존재하면 업데이트합니다.
   * @param {PlatformAfreecaEntity} data 아프리카 연동 정보 Entity
   */
  async linkAfreeca(data: PlatformAfreecaEntity): Promise<PlatformAfreecaEntity> {
    const alreadyLinked = await this.afreecaRepository.findOne(data.afreecaId);
    if (alreadyLinked) {
      // 이미 해당 afreeca 유저와 연동된 아이디가 있는 경우 "업데이트"
      this.afreecaRepository.update([
        'afreecaId', 'refreshToken', 'afreecaStreamerName', 'logo',
      ], data);
      return data;
    }
    return this.afreecaRepository.save(data);
  }

  // *********************************************************
  // ****************** 연동된 유저정보를 최신화 *******************
  /**
   * 트위치 연동 유저정보를 최신화합니다.
   * @param {string} twitchId 연동 정보를 최신화 하고자 하는 트위치 고유 ID
   */
  public async refreshTwitchInfo(twitchId: string): Promise<PlatformTwitchEntity> {
    const twitchInfo = await this.twitchRepository.findOne(twitchId);

    // Get access token
    const res = await Axios.post([
      'https://id.twitch.tv/oauth2/token?grant_type=refresh_token',
      `&refresh_token=${twitchInfo.refreshToken}`,
      `&client_id=${this.configService.get<string>('TWITCH_CLIENT_ID')}`,
      `&client_secret=${this.configService.get<string>('TWITCH_CLIENT_SECRET')}`,
    ].join(''));
    const { access_token: accessToken, refresh_token: refreshToken } = res.data;

    // Get User profile data
    const userProfileRes = await Axios.get<TwitchProfileResponse>(
      'https://api.twitch.tv/helix/users', {
        headers: {
          'Client-ID': this.configService.get<string>('TWITCH_CLIENT_ID'),
          Accept: 'application/vnd.twitchtv.v5+json',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const { data } = userProfileRes.data;
    const profile = data[0];

    // Update twitch profile
    return this.linkTwitch({
      twitchId: profile.id,
      twitchChannelName: profile.display_name,
      twitchStreamerName: profile.login,
      logo: profile.profile_image_url,
      refreshToken,
    });
  }

  /**
   * 유튜브 연동 유저정보를 최신화합니다.
   * @param {string} youtubeId 연동 정보를 최신화 하고자 하는 유튜브 고유 ID
   */
  public async refreshYoutubeInfo(youtubeId: string): Promise<PlatformYoutubeEntity> {
    const youtubeInfo = await this.youtubeRepository.findOne(youtubeId);

    // Get access token
    const res = await Axios.post([
      'https://accounts.google.com/o/oauth2/token',
      '?grant_type=refresh_token',
      `&refresh_token=${youtubeInfo.refreshToken}`,
      `&client_id=${this.configService.get<string>('YOUTUBE_CLIENT_ID')}`,
      `&client_secret=${this.configService.get<string>('YOUTUBE_CLIENT_SECRET')}`,
    ].join(''));
    const { access_token: accessToken } = res.data;

    // Get Google user profile data
    const googleProfileRes = await Axios.get(
      'https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      },
    );
    const newGoogleInfo = googleProfileRes.data;

    // Get Youtube user profile data
    const newYoutubeProfileRes = await Axios.get(
      'https://www.googleapis.com/youtube/v3/channels', {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: { part: 'snippet,id', mine: true },
      },
    );

    const newYoutubeChannelInfo = newYoutubeProfileRes.data.items[0];
    return this.linkYoutube({
      refreshToken: youtubeInfo.refreshToken,
      googleId: newGoogleInfo.sub,
      googleEmail: newGoogleInfo.email,
      googleLogo: newGoogleInfo.picture.replace('/s96-', '/s{size}-'),
      googleName: newGoogleInfo.name,
      youtubeId: newYoutubeChannelInfo.id,
      youtubeTitle: newYoutubeChannelInfo.snippet.title,
      youtubeLogo: newYoutubeChannelInfo.snippet.thumbnails.default.url.replace('=s88-', '=s{size}-'),
      youtubePublishedAt: newYoutubeChannelInfo.snippet.publishedAt,
    });
  }

  /**
   * 아프리카 연동 유저정보를 최신화합니다.
   * @param {string} afreecaId 연동 정보를 최신화 하고자 하는 아프리카 고유 ID
   */
  public async refreshAfreecaInfo(afreecaId: string): Promise<any> {
    const afreecaInfo = await this.afreecaRepository.findOne(afreecaId);

    // Get access token - 토큰 리프레시
    const {
      // accessToken,
      refreshToken,
    } = await this.afreecaLinker.refresh(afreecaInfo.refreshToken);

    // ***************************************************
    // Get Afreeca user profile data
    // 2020.12.08 아직 아프리카 openAPI에서 profile을 제공하지 않아 진행할 수 없음..
    // const newProfile = {}; // Profile 요청으로 받아온 데이터라고 가정
    // accessToken 사용

    // 업데이트
    return this.linkAfreeca({
      afreecaId: afreecaInfo.afreecaId, // 아프리카로부터 받아온 최신 newProfile 에서 참조하는 것으로 수정.
      afreecaStreamerName: afreecaInfo.afreecaStreamerName, // 아프리카로부터 받아온 최신 newProfile 에서 참조하는 것으로 수정.
      refreshToken,
    });
  }

  /**
   * 트위치 크리에이터를 분석 및 수집 타겟으로 추가 WhileTrueCollectorDB의 TwitchTargetStreamers 테이블에 크리에이터를 추가
   * @param target TwitchTargetStreamersEntity
   * @returns TwitchTargetStreamersEntity
   */
  private addTwitchTargetStreamer(target: TwitchTargetStreamersEntity) {
    return this.twitchTargetStreamersRepository.save(target);
  }

  /**
   * 아프리카 크리에이터를 분석 및 수집 타겟으로 추가
   * WhileTrueCollectorDB의 AfreecaTargetStreamers와 AfreecaActiveStreams테이블에 크리에이터를 추가
   * @param target AfreecaTargetStreamersEntity
   * @returns AfreecaTargetStreamersEntity
   */
  private async addAfreecaTargetStreamer(target: AfreecaTargetStreamersEntity): Promise<void> {
    return getConnection('WhileTrueCollectorDB').transaction(async (em) => {
      await em.save(AfreecaTargetStreamersEntity, target);
      const activeStreams: AfreecaActiveStreamsEntity = {
        creatorId: target.creatorId,
        startDate: new Date(),
        endDate: new Date(),
        creatorName: target.creatorName,
      };
      await em.save(AfreecaActiveStreamsEntity, activeStreams);
    });
  }
}
