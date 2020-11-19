import {
  Column, Entity, OneToMany, PrimaryColumn,
} from 'typeorm';
import { BroadDetailEntity } from '../../broad/entities/broadDetail.entity';

@Entity('AfreecaCategory')
export class BroadCategoryEntity {
  @PrimaryColumn()
  @OneToMany(() => BroadDetailEntity, (broadDetail) => broadDetail.broadCategory)
  categoryId: string;

  @Column({ comment: '카테고리 한글 이름' })
  categoryNameKr: string;

  @Column({ comment: '하위 카테고리 여부, 1=하위카테고리, 0=아님' })
  isSub: boolean;

  @Column({ comment: '상위 카테고리 Id', nullable: true })
  parentCategoryId?: string;
}
