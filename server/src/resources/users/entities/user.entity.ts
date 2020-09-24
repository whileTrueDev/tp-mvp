import {
  Entity, Column, OneToOne, CreateDateColumn, UpdateDateColumn, OneToMany
} from 'typeorm';
import { Exclude } from 'class-transformer';

// Related Entities
import { IsOptional } from 'class-validator';
import { PlatformTwitchEntity } from './platformTwitch.entity';
import { PlatformAfreecaEntity } from './platformAfreeca.entity';
import { PlatformYoutubeEntity } from './platformYoutube.entity';
import { SubscribeEntity } from './subscribe.entity';

@Entity({ name: 'UserTest' })
export class UserEntity {
  // For Exclude Decorator
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
  @Column({ primary: true, length: 20 })
  userId!: string

  @Column({ length: 30 })
  nickName!: string;

  @Column({ nullable: false, length: 15 })
  name!: string;

  @Column({ length: 50 })
  mail!: string;

  @Column({ length: 50 })
  phone!: string;

  @Column({ length: 70, unique: true })
  userDI?: string;

  // The ClassSerializerInterceptor interceptor uses the powerful class-transformer package
  // to provide a declarative and extensible way of transforming objects
  // it can apply rules expressed by class-transformer decorators on an entity/DTO class
  @Exclude()
  @Column({ nullable: false })
  password!: string;

  @Column({ length: 10 })
  birth!: string;

  @Column({ length: 1 })
  gender!: string;

  @Column({ default: 'user' })
  roles?: string;

  @Exclude()
  @OneToOne(() => PlatformTwitchEntity, (twitch) => twitch.twitchId)
  @Column({ nullable: true })
  twitchId?: string;

  @Exclude()
  @OneToOne(() => PlatformAfreecaEntity, (affreca) => affreca.afreecaId)
  @Column({ nullable: true })
  afreecaId?: string;

  @Exclude()
  @OneToOne(() => PlatformYoutubeEntity, (youtube) => youtube.youtubeId)
  @Column({ nullable: true })
  youtubeId?: string;

  @Column()
  marketingAgreement: boolean;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
