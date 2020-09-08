import {
  Entity, Column, OneToOne, CreateDateColumn, UpdateDateColumn
} from 'typeorm';
import { Exclude } from 'class-transformer';

// Related Entities
import { PlatformTwitchEntity } from './platformTwitch.entity';
import { PlatformAfreecaEntity } from './platformAfreeca.entity';
import { PlatformYoutubeEntity } from './platformYoutube.entity';

@Entity({ name: 'UserTest' })
export class UserEntity {
  // For Exclude Decorator
  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }

  @Column({ primary: true })
  userId!: string

  @Column({ nullable: false, length: 30 })
  name!: string;

  @Column()
  mail!: string;

  @Column({ length: 64 })
  userDI?: string;

  // The ClassSerializerInterceptor interceptor uses the powerful class-transformer package
  // to provide a declarative and extensible way of transforming objects
  // it can apply rules expressed by class-transformer decorators on an entity/DTO class
  @Exclude()
  @Column({ nullable: false })
  password!: string;

  @Column()
  birth!: string;

  @Column()
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
