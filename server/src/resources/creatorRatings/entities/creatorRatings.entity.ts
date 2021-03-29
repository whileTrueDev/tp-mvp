import { CreatorRatings } from '@truepoint/shared/dist/interfaces/CreatorRatings.interface';
import {
  Entity, Column,
  CreateDateColumn, PrimaryGeneratedColumn, UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'CreatorRatings' })
export class CreatorRatingsEntity implements CreatorRatings {
  constructor(partial: Partial<CreatorRatingsEntity>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  creatorId: string;

  @Column()
  userIp: string;

  @Column({ nullable: true })
  userId: string;

  @Column()
  rating: number;

  @CreateDateColumn({ type: 'timestamp', comment: '테이블에 삽입된 날짜' })
  createDate: Date;

  @UpdateDateColumn({ type: 'timestamp', comment: '수정된 날짜' })
  updateDate: Date;
}
