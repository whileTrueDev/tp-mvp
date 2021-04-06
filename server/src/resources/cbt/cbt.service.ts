import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCbtUserDto } from '@truepoint/shared/dto/cbt/createCbtUser.dto';
import { User } from '@truepoint/shared/interfaces/User.interface';
import { Repository } from 'typeorm';
import { CbtInquiryEntity } from '../cbtinquiry/entities/cbtinquiry.entity';
import { PlatformAfreecaEntity } from '../users/entities/platformAfreeca.entity';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class CbtService {
  constructor(
    @InjectRepository(CbtInquiryEntity)
    private readonly cbtInquiryRepository: Repository<CbtInquiryEntity>,
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(PlatformAfreecaEntity)
    private readonly afreecaRepository: Repository<PlatformAfreecaEntity>,
  ) {}

  /**
   * 모든 CBT 신청 목록 조회 메소드
   */
  public async findList(): Promise<CbtInquiryEntity[]> {
    return this.cbtInquiryRepository.find({ order: { createdAt: 'DESC' } });
  }

  /**
   * 개별 CBT 신청 조회 메소드
   * @param id 개별 CBT 신청 번호
   */
  public async findOne(id: string): Promise<CbtInquiryEntity> {
    return this.cbtInquiryRepository.findOne(id);
  }

  /**
   * CBT 유저 생성 메소드
   * @param dto CBT 유저 생성 DTO shared/dto/cbt/createCbtUser.dto.ts 확인
   */
  public async createCbtUser(dto: CreateCbtUserDto): Promise<UserEntity> {
    const createuser: User = {
      userId: dto.idForTest,
      userDI: `CBT_${dto.idForTest}_${new Date().getTime()}`,
      nickName: dto.creatorName,
      name: dto.name,
      mail: dto.email,
      phone: dto.phoneNum,
      password: '$2b$10$4wceyfuHBgJj8gA/dWDCleQObCqNa0qPaQSWfoMrQJkKB3O4uNhP2', // 기본 비밀번호 ??????? slack에서 확인.
      roles: 'CBT_USER',
      birth: '',
      gender: '',
      marketingAgreement: false,
    };

    // 유저가 아프리카인 경우 AfreecaId admin 서버로 부터 받은 아프리카 아이디를 넣어준다. ex.) arinbbidol
    if (dto.platform === 'afreeca' && dto.afreecaId) {
      createuser.afreecaId = dto.afreecaId;

      // PlatformAfreeca 추가
      this.afreecaRepository.save({
        afreecaId: dto.afreecaId,
        afreecaStreamerName: dto.creatorName,
        refreshToken: `_CBT_USER_${dto.afreecaId}`,
      });
    }
    const createdUser = this.usersRepository.save(createuser);

    const inquiry = await this.cbtInquiryRepository.findOne({ where: { idForTest: dto.idForTest } });
    this.cbtInquiryRepository.save({
      ...inquiry,
      isComplete: true,
    });
    return createdUser;
  }
}
