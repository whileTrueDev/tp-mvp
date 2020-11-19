import {
  Column, CreateDateColumn, Entity, Index, OneToMany, PrimaryColumn,
} from 'typeorm';
import { BroadDetailEntity } from './broadDetail.entity';

@Entity('afreecaBroad')
export class BroadEntity {
  @OneToMany(() => BroadDetailEntity, (broadDetail) => broadDetail.broadId)
  @PrimaryColumn()
  broadId: string;

  @Column({ comment: '방송 시작시 제목' })
  firstTitle: string;
  // - broad_title string 방송 제목입니다.

  @Column({ type: 'timestamp', comment: '방송 시작 시간' })
  broadStartedAt: Date | string;
  // - broad_start string 방송 시작 시간입니다.

  @Column({ comment: '아프리카 BJ 로그인 아이디' })
  @Index('userId_index')
  userId: string;
  // - user_id string BJ 아이디입니다.

  @Column({ comment: '아프리카 BJ 닉네임' })
  @Index('userNick_index')
  userNick: string;
  // - user_nick string BJ 닉네임입니다.

  @CreateDateColumn({ type: 'timestamp' })
  @Index('createdAt_index')
  createdAt?: Date;
}
