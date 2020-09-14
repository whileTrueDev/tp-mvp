import { Entity, Column, OneToOne, } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'Subscription' })
export class PlatformAfreecaEntity {
  @OneToOne((type) => UserEntity, (user) => user.userId)
  @Column({ primary: true })
  userId: string;

  @Column()
  type: string;

  @Column()
  userIdList: string[];

  @Column()
  userIdSlot: string[];
}
