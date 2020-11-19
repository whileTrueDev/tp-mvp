import {
  Column, CreateDateColumn, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn,
} from 'typeorm';
import { BroadCategoryEntity } from '../../category/entities/category.entity';
import { BroadEntity } from './broad.entity';

@Entity('AfreecaBroadDetail')
export class BroadDetailEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column({ comment: '방송 제목' })
  title: string;
  // - broad_title string 방송 제목입니다.

  @Column({ comment: '탐방 허용 상태, 0=탐방사절, 1=탐방허용' })
  visitBroadType: number;
  // (0:허용, 1:사절)
  // *탐방사절이란, 방송이 사전 동의 없이 무단으로 재송출됨을 거절하는 의사 표현 UI입니다.

  @Column({ type: 'tinyint', comment: '비번방 상태, 0=비번방X, 1=비번방O' })
  isPassword: string | number;
  // (1:비밀번호 설정 방송, 0:미설정 방송)
  // *비밀번호는 영문+숫자의 조합이며, 6자이상으로 설정해야 합니다.

  @Index('broadCategory_index')
  @ManyToOne(() => BroadCategoryEntity, (category) => category.categoryId)
  @JoinColumn({ name: 'broadCategory' })
  broadCategory: string
  // *카테고리 리스트는 본 개발 가이드 항목의 최하단 ‘카테고리 리스트’를 참고 부탁 드립니다.

  @Index('broadId_index')
  @ManyToOne(() => BroadEntity, (b) => b.broadId, { cascade: ['update', 'remove'] })
  @JoinColumn({ name: 'broadId' })
  broadId: string;
  // - broad_no string 방송 번호입니다.

  @Column({ comment: '방송 썸네일' })
  broadThumb: string;
  // - broad_thumb string 방송 썸네일입니다.
  // *방송 썸네일은 480x270 사이즈이며, 확장자는 jpg입니다.

  @Column({ comment: '방송 등급, 19=연령제한, 0=일반' })
  broadGrade: string
  // - broad_grade string 방송 등급입니다.(19:연령 제한 방송, 0:일반 방송)
  // *연령 제한 방송은 19세 미만 시청 불가입니다.

  @Column({ comment: '방송 화질, kbps단위' })
  broadBps: string;
  // - broad_bps string 방송 화질입니다.
  // *단위는 kbps이며, 최대 8000kbps까지 설정 가능합니다.

  @Column({ comment: '방송 해상도, 1280x720 or 1920x1080' })
  broadResolution: string;
  // - broad_resolution string 방송 해상도입니다.
  // *1280x720/1920x1080등의 해상도가 있습니다.

  @Column({ comment: '총 시청자 수' })
  viewCount: number;
  // - total_view_cnt string 총 시청자 수입니다.

  @CreateDateColumn()
  @Index('createdAt_index')
  createdAt?: Date;
}
