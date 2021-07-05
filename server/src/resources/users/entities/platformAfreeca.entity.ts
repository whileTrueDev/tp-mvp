import { PlatformAfreeca } from '@truepoint/shared/dist/interfaces/PlatformAfreeca.interface';
import {
  Entity, Column, CreateDateColumn, UpdateDateColumn, JoinTable, ManyToMany, OneToOne,
} from 'typeorm';
import { CreatorCategoryEntity } from '../../creator-category/entities/creatorCategory.entity';
import { UserEntity } from './user.entity';

@Entity({ name: 'PlatformAfreeca' })
export class PlatformAfreecaEntity implements PlatformAfreeca {
  @Column({ primary: true })
  afreecaId!: string;

  @Column({ nullable: false })
  refreshToken!: string;

  @Column({ nullable: true }) // ex) 저라뎃
  afreecaStreamerName?: string;

  @Column({ nullable: true })
  logo?: string;

  @OneToOne(() => UserEntity, (user) => user.twitch)
  user?: UserEntity;

  @CreateDateColumn({ type: 'timestamp', comment: '첫 연동 날짜' })
  createdAt?: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: '연동 정보 최신화 날짜' })
  updatedAt?: Date;

  @ManyToMany((type) => CreatorCategoryEntity, (category) => category.afreecaCreator)
  @JoinTable()
  categories?: CreatorCategoryEntity[]

  @Column({ default: 0, comment: '방송인 검색횟수' })
  searchCount?: number;
}
