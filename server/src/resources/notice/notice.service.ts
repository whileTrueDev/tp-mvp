import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NoticeDto } from '@truepoint/shared/dist/dto/admin/notice/notice.dto';
import { NoticePatchRequest } from '@truepoint/shared/dist/dto/admin/notice/noticePatchRequest.dto';
import { Repository } from 'typeorm';
import { NoticeEntity } from './entities/notice.entity';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(NoticeEntity)
    private readonly noticeRepository: Repository<NoticeEntity>,

  ) {}

  /**
   * 공지사항 리스트 조회 메소드
   * @param limit optional, 가져오는 수 제한
   */
  public async findAll(limit?: number): Promise<NoticeEntity[]> {
    return this.noticeRepository
      .createQueryBuilder()
      .orderBy('isImportant', 'DESC')
      .addOrderBy('createdAt', 'DESC')
      .limit(limit)
      .getMany();
  }

  /**
   * 중요공지를 포함한 총 5개의 대략적 공지사항 아웃라인 조회 메소드
   * @param important optional, default = 2, 조회할 중요공지 숫자
   */
  public async findOutline(important = 2): Promise<NoticeEntity[]> {
    // select * from Notice where isImportant = 1 order by createdAt DESC LIMIT 2
    // select * from Notice where isImportant = 0 order by createdAt DESC LIMIT 3
    const importantNotice = await this.noticeRepository
      .createQueryBuilder()
      .where('isImportant = 1')
      .orderBy('createdAt', 'DESC')
      .limit(important)
      .getMany();

    const newNotice = await this.noticeRepository
      .createQueryBuilder()
      .where('isImportant = 0')
      .orderBy('createdAt', 'DESC')
      .limit(5 - importantNotice.length)
      .getMany();

    return importantNotice.concat(newNotice);
  }

  /**
   * 개별 공지사항 글 조회 메소드
   * @param id 공지사항 개별글 번호
   */
  public async findOne(id: number): Promise<NoticeEntity> {
    return this.noticeRepository.findOne(id);
  }

  /**
   * 공지사항 생성 메소드
   * @param noticeData 생성할 공지사항 데이터 NoticePatchRequest
   */
  public async createNotice(noticeData: NoticeDto): Promise<NoticeEntity> {
    return this.noticeRepository.save(noticeData);
  }

  /**
   * 개별 공지사항 글 변경 메소드
   * @param noticeData 변경할 공지사항 데이터 해당 공지사항의 고유 id를 포함해야합니다.
   */
  public async updateNotice(noticeData: NoticePatchRequest): Promise<number> {
    const {
      category, author, title, content, isImportant, id,
    } = noticeData;
    const result = await this.noticeRepository
      .update({ id }, {
        category, author, title, content, isImportant,
      });
    return result.affected;
  }

  /**
   * 개별 공지사항 글 삭제 메소드
   * @param id 삭제할 공지사항의 고유 번호
   */
  public async deleteNotice(id: number | string): Promise<number> {
    const result = await this.noticeRepository.delete(id);
    return result.affected;
  }
}
