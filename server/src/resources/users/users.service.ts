import bcrypt from 'bcrypt';
import {
  Injectable, HttpException, HttpStatus, BadRequestException, InternalServerErrorException,
  ForbiddenException, Inject, forwardRef,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from '@truepoint/shared/dist/dto/users/updateUser.dto';
import { ProfileImages } from '@truepoint/shared/dist/res/ProfileImages.interface';
import { ChannelNames } from '@truepoint/shared/dist/res/ChannelNames.interface';
import { BriefInfoDataResType } from '@truepoint/shared/dist/res/BriefInfoData.interface';
import { LinkPlatformError, LinkPlatformRes } from '@truepoint/shared/dist/res/LinkPlatformRes.interface';
import { EditingPointListResType } from '@truepoint/shared/dist/res/EditingPointListResType.interface';
import Axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { UserEntity } from './entities/user.entity';
import { UserTokenEntity } from './entities/userToken.entity';
import { SubscribeEntity } from './entities/subscribe.entity';
import { PlatformTwitchEntity } from './entities/platformTwitch.entity';
import { PlatformAfreecaEntity } from './entities/platformAfreeca.entity';
import { PlatformYoutubeEntity } from './entities/platformYoutube.entity';
import { TwitchTargetStreamersEntity } from '../../collector-entities/twitch/targetStreamers.entity';
import { AfreecaTargetStreamersEntity } from '../../collector-entities/afreeca/targetStreamers.entity';
import { YoutubeTargetStreamersEntity } from '../../collector-entities/youtube/targetStreamers.entity';
import { TwitchProfileResponse } from '../auth/interfaces/twitchProfile.interface';
import { AfreecaLinker } from '../auth/strategies/afreeca.linker';
import { AfreecaActiveStreamsEntity } from '../../collector-entities/afreeca/activeStreams.entity';
import { StreamsEntity } from '../stream-analysis/entities/streams.entity';
@Injectable()
export class UsersService {
  // eslint-disable-next-line max-params
  constructor(
    private readonly configService: ConfigService,
    @Inject(forwardRef(() => AfreecaLinker))
    private readonly afreecaLinker: AfreecaLinker,
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
  ) {}

  private resizeingYoutubeLogo(youtubeLogoString: string): string {
    return youtubeLogoString.replace('{size}', '150');
  }

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

  /**
   * 특정 유저의 연동된 플랫폼의 프로필 이미지 정보를 반환하는 메서드
   * @param userId 프로필 이미지 정보를 열람하고자 하는 유저 아이디
   */
  async findOneProfileImage(userId: string): Promise<ProfileImages> {
    const user = await this.usersRepository.findOne(userId);
    const images = [];

    // 아프리카는 OPEN API 업데이트 이후 추가 20.11.18 hwasurr
    // const afreecaLink = await this.afreecaRepository.findOne(user.afreecaId);
    // if (afreecaLink) images.push({ platform: 'afreeca', logo: afreecaLink.logo });
    if (user.twitchId) {
      const twitchLink = await this.twitchRepository.findOne(user.twitchId);
      if (twitchLink) images.push({ platform: 'twitch', logo: twitchLink.logo });
    }

    if (user.youtubeId) {
      const youtubeLink = await this.youtubeRepository.findOne(user.youtubeId);
      if (youtubeLink) {
        images.push(
          { platform: 'youtube', logo: this.resizeingYoutubeLogo(youtubeLink.youtubeLogo) },
        );
      }
    }
    return images;
  }

  async findChannelNames(userId: string): Promise<ChannelNames> {
    const user = await this.usersRepository.findOne(userId);
    const nickNames: ChannelNames = [];

    // 아프리카는 OPEN API 업데이트 이후 추가 20.11.18 hwasurr
    // const afreecaLink = await this.afreecaRepository.findOne(user.afreecaId);
    // if (afreecaLink) images.push({ platform: 'afreeca', logo: afreecaLink.logo });

    if (user.twitchId) {
      const twitchLink = await this.twitchRepository.findOne(user.twitchId);
      if (twitchLink) nickNames.push({ platform: 'twitch', nickName: twitchLink.twitchChannelName });
    }

    if (user.youtubeId) {
      const youtubeLink = await this.youtubeRepository.findOne(user.youtubeId);
      if (youtubeLink) {
        nickNames.push(
          { platform: 'youtube', nickName: youtubeLink.youtubeTitle },
        );
      }
    }
    return nickNames;
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
      afreecaId: '',
      youtubeId: '',
      twitchId: '',
      password: '',
      birth: '',
      gender: '',
      marketingAgreement: false,
      phone: '',
    });
    return result.affected;
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
   * }[]
   */
  async getEditingPointList(platform: 'afreeca'|'twitch'): Promise<EditingPointListResType[]> {
    let result: EditingPointListResType[];
    try {
      // PlatformAfreecaEntity 에 없는 userId, nickname 존재하여 빈 값이 있음
      if (platform === 'afreeca') {
        result = await this.streamsRepository.createQueryBuilder('streams')
          .leftJoinAndSelect(PlatformAfreecaEntity, 'afreeca', 'streams.creatorId = afreeca.afreecaId')
          .select([
            'streams.creatorId AS creatorId',
            'streams.platform AS platform',
            'streams.userId AS userId',
            'streams.title AS title',
            'MAX(streams.endDate) AS endDate',
            'afreeca.afreecaStreamerName AS nickname',
          ])
          .where('streams.platform = :platform', { platform })
          .groupBy('streams.creatorId')
          .orderBy('MAX(streams.endDate)', 'DESC')
          .getRawMany();
      }

      // AfreecaTargetStreamersEntity 와 조인시
      // TypeError: Class constructor AfreecaTargetStreamersEntity cannot be invoked without 'new'
      // if (platform === 'afreeca') {
      //   result = await this.streamsRepository.createQueryBuilder('streams')
      //     .leftJoinAndSelect(AfreecaTargetStreamersEntity, 'afreeca', 'streams.creatorId = afreeca.creatorId')
      //     .select([
      //       'streams.creatorId AS creatorId',
      //       'streams.platform AS platform',
      //       'streams.userId AS userId',
      //       'streams.title AS title',
      //       'MAX(streams.endDate) AS endDate',
      //       'afreeca.creatorName AS nickname',
      //     ])
      //     .where('streams.platform = :platform', { platform })
      //     .groupBy('streams.creatorId')
      //     .orderBy('MAX(streams.endDate)', 'DESC')
      //     .getRawMany();
      // }

      if (platform === 'twitch') {
        result = await this.streamsRepository.createQueryBuilder('streams')
          .leftJoinAndSelect(UserEntity, 'users', 'streams.creatorId = users.twitchId')
          .select([
            'streams.creatorId AS creatorId',
            'streams.platform AS platform',
            'streams.userId AS userId',
            'streams.title AS title',
            'MAX(streams.endDate) AS endDate',
            'users.nickName AS nickName',
          ])
          .where('streams.platform = :platform', { platform })
          .groupBy('streams.creatorId')
          .orderBy('MAX(streams.endDate)', 'DESC')
          .getRawMany();
      }
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException('Error in getEditingPointList');
    }

    return result;
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

  async linkUserToPlatform(
    userId: string, platform: string, platformId: string,
  ): Promise<LinkPlatformRes> {
    // 적재된 연동 데이터의 고유 아이디를 실제 트루포인트 유저 정보에 추가
    // 어느 트루포인트 유저가 트위치 연동을 진행했는 지 곧바로 알 수 없음..
    // twitch accesstoken 발급 이후 프론트로 리다이렉트할 때 방금 유저의 고유 id와 플랫폼 정보를 전달하고,
    // 그 정보를 다시 백엔드에서 받아와 올바르 유저에 맞게 적재하는 방식.
    // 현재 이 메서드는 백엔드에서 받아와 올바르 유저에 맞게 적재하는 작업을 진행.
    const targetUser = await this.usersRepository.findOne(userId);

    // 현재 받아온 platformId가 연동된 플랫폼 정보가 있는지 체크 작업 필요
    // platformTwitch, platformYoutube, platformAfreeca 등을 체크한 후 있으면 그 때 넣도록 처리.
    switch (platform) {
      case 'twitch': {
        // 연동platform 정보 가져오기
        const linkedInfo = await this.twitchRepository.findOne(platformId);
        // 이미 나에게 연동된 경우 다시 반복하지 않음.
        if (targetUser.twitchId === platformId) return 'already-linked';

        if (linkedInfo) {
          // 해당 Platform 아이디가 이미 다른 유저에게 연동된 Platform 계정인지 확인하여 이미 연동된 계정이 있는 경우 에러 처리
          const alreadyLinkedTwitchId = await this.usersRepository.findOne({ twitchId: platformId });
          if (alreadyLinkedTwitchId) {
            // 해당 TwitchId 계정이 이미 다른 유저에게 연동된 TwitchId 계정.
            const errMsg: LinkPlatformError = {
              message: 'linked-with-other',
              data: {
                userId: alreadyLinkedTwitchId.userId,
                platformUserName: linkedInfo.twitchChannelName,
              },
            };
            throw new ForbiddenException(errMsg);
          }
          // 실제 연동 가능 -> 연동 처리
          targetUser[`${platform}Id`] = platformId;
          // ************************************************
          // CollectorDB target Streamer에 추가
          this.twitchTargetStreamersRepository.save({
            streamerId: linkedInfo.twitchId,
            streamerName: linkedInfo.twitchChannelName,
            streamerChannelName: linkedInfo.twitchStreamerName,
          });
        } else {
          throw new InternalServerErrorException(
            'An error occurred during linking platform: there is no platform information',
          );
        }
        break;
      }
      case 'youtube': {
        // 연동platform 정보 가져오기
        const linkedInfo = await this.youtubeRepository.findOne(platformId);
        // 이미 나에게 연동된 경우 다시 반복하지 않음.
        if (targetUser.youtubeId === platformId) return 'already-linked';

        // 해당 Platform 아이디가 이미 다른 유저에게 연동된 Platform 계정인지 확인
        if (linkedInfo) {
          const alreadyLinkedYoutubeId = await this.usersRepository.findOne({ youtubeId: platformId });
          if (alreadyLinkedYoutubeId) {
            // 해당 Youtube 계정이 이미 다른 유저에게 연동된 Youtube 계정.
            const errMsg: LinkPlatformError = {
              message: 'linked-with-other',
              data: {
                userId: alreadyLinkedYoutubeId.userId,
                platformUserName: linkedInfo.youtubeTitle,
              },
            };
            throw new ForbiddenException(errMsg);
          }

          // 실제 연동 가능 -> 연동 처리
          targetUser[`${platform}Id`] = platformId;
          // ************************************************
          // CollectorDB target Streamer에 추가
          await this.youtubeTargetStreamersRepository.save({
            channelId: linkedInfo.youtubeId,
            channelName: linkedInfo.youtubeTitle,
            refresh_token: linkedInfo.refreshToken,
          });
        } else {
          throw new InternalServerErrorException(
            'An error occurred during linking platform: there is no platform information',
          );
        }
        break;
      }
      case 'afreeca': {
        // 연동platform 정보 가져오기
        const linkedInfo = await this.afreecaRepository.findOne(platformId);
        // 이미 나에게 연동된 경우 다시 반복하지 않음.
        if (targetUser.afreecaId === platformId) return 'already-linked';

        // 해당 Platform 아이디가 이미 다른 유저에게 연동된 Platform 계정인지 확인
        if (linkedInfo) {
          const alreadyLinkedAfreecaId = await this.usersRepository.findOne({ afreecaId: platformId });
          if (alreadyLinkedAfreecaId) {
            // 해당 Youtube 계정이 이미 다른 유저에게 연동된 Youtube 계정.
            const errMsg: LinkPlatformError = {
              message: 'linked-with-other',
              data: {
                userId: alreadyLinkedAfreecaId.userId,
                platformUserName: linkedInfo.afreecaStreamerName,
              },
            };
            throw new ForbiddenException(errMsg);
          }

          // 실제 연동 가능 -> 연동 처리
          targetUser[`${platform}Id`] = platformId;
          // ************************************************
          // CollectorDB target Streamer에 추가
          // by hwasurr 2020. 12. 08 아직 Afreeca openAPI 에서는 ProfileData를 제공하지 않기 때문에 주석처리. 향후 업데이트 필요
          this.afreecaTargetStreamersRepository.save({
            creatorId: linkedInfo.afreecaId,
            creatorName: linkedInfo.afreecaStreamerName ? linkedInfo.afreecaStreamerName : '아프리카Profile제공X-업데이트 필요',
            refreshToken: linkedInfo.refreshToken,
          });
          // CollectorDB active Streams 에 추가
          // by hwasurr 2020. 12. 10 아직 Afreeca openAPI 에서는 ProfileData를 제공하지 않기 때문에 주석처리. 향후 업데이트 필요
          this.afreecaActiveStreamsRepository.save({
            creatorId: linkedInfo.afreecaId,
            creatorName: linkedInfo.afreecaStreamerName ? linkedInfo.afreecaStreamerName : '아프리카Profile제공X-업데이트 필요',
          });
          break;
        } else {
          throw new InternalServerErrorException(
            'An error occurred during linking platform: there is no platform information',
          );
        }
      }
      default: throw new BadRequestException('platform must be one of "twitch" | "afreeca" | "youtube"');
    }
    return this.usersRepository.save(targetUser);
  }

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
      deletedPlatformId = targetUser.afreecaId;
      // ************************************************
      // CollectorDB Target Streamer에서 제거
      const targetUserOnCollector = await this.afreecaTargetStreamersRepository.findOne(targetUser.afreecaId);
      if (targetUserOnCollector) this.afreecaTargetStreamersRepository.remove(targetUserOnCollector);

      // CollectorDB ActiveStreams 에서 제거
      const targetActiveStreamOnCollector = await this.afreecaActiveStreamsRepository.findOne({
        creatorId: targetUser.afreecaId,
      });
      if (targetActiveStreamOnCollector) this.afreecaActiveStreamsRepository.remove(targetActiveStreamOnCollector);

      // 선택된 로고 + 닉네임 제거
      const afreeca = await this.afreecaRepository.findOne(targetUser.afreecaId);
      if (afreeca) {
        targetPlatformLogo = afreeca.logo;
        targetPlatformNickname = afreeca.afreecaStreamerName;
      }
    }
    if (platform === 'twitch') {
      deletedPlatformId = targetUser.twitchId;
      // ************************************************
      // CollectorDB Target Streamer에서 제거
      const targetUserOnCollector = await this.twitchTargetStreamersRepository.findOne(targetUser.twitchId);
      if (targetUserOnCollector) this.twitchTargetStreamersRepository.remove(targetUserOnCollector);

      // 선택된 로고 + 닉네임 제거
      const twitch = await this.twitchRepository.findOne(targetUser.twitchId);
      if (twitch) {
        targetPlatformLogo = twitch.logo;
        targetPlatformNickname = twitch.twitchChannelName;
      }
    }
    if (platform === 'youtube') {
      deletedPlatformId = targetUser.youtubeId;
      // ************************************************
      // CollectorDB Target Streamer에서 제거
      const targetUserOnCollector = await this.youtubeTargetStreamersRepository.findOne(targetUser.youtubeId);
      if (targetUserOnCollector) this.youtubeTargetStreamersRepository.remove(targetUserOnCollector);

      // 선택된 로고 + 닉네임 제거
      const youtube = await this.youtubeRepository.findOne(targetUser.youtubeId);
      if (youtube) {
        targetPlatformLogo = this.resizeingYoutubeLogo(youtube.youtubeLogo);
        targetPlatformNickname = youtube.youtubeTitle;
      }
    }

    // 플랫폼 연결 정보 삭제 및 대표 프로필 사진|닉네임이 해당 플랫폼의 프로필사진|닉네임인 경우 함께 삭제
    await this.usersRepository.update(
      userId, {
        [`${platform}Id`]: undefined,
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
}
