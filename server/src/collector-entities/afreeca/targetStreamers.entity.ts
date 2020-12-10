import {
  Column, CreateDateColumn, Entity, UpdateDateColumn,
} from 'typeorm';

@Entity('AfreecaTargetStreamers')
export class AfreecaTargetStreamersEntity {
  @Column({ primary: true })
  creatorId: string;

  @Column()
  creatorName: string;

  @Column({ length: 150 })
  refreshToken: string;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updatedAt: Date;
}
