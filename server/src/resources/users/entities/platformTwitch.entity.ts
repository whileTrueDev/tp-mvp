import { PlatformTwitch } from '@truepoint/shared/dist/interfaces/PlatformTwitch.interface';
import {
  Entity, Column, CreateDateColumn, UpdateDateColumn, JoinTable, ManyToMany,
} from 'typeorm';
import { CreatorCategoryEntity } from '../../creator-category/entities/creatorCategory.entity';
@Entity({ name: 'PlatformTwitch' })
export class PlatformTwitchEntity implements PlatformTwitch {
  @Column({ primary: true })
  twitchId!: string;

  @Column()
  logo!: string;

  // ex) 침착맨
  @Column()
  twitchStreamerName!: string;

  // ex) zilioner
  @Column()
  twitchChannelName!: string;

  @Column()
  refreshToken!: string;

  @CreateDateColumn({ type: 'timestamp', comment: '첫 연동 날짜' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: '연동 정보 최신화 날짜' })
  updatedAt?: Date;

  @ManyToMany((type) => CreatorCategoryEntity, (category) => category.twitchCreator)
  @JoinTable()
  categories?: CreatorCategoryEntity[]
}
