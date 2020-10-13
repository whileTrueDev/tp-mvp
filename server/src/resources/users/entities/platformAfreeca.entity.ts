import { PlatformAfreeca } from '@truepoint/shared/dist/interfaces/PlatformAfreeca.interface';
import { Entity, Column, OneToOne } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'PlatformAfreeca' })
export class PlatformAfreecaEntity implements PlatformAfreeca {
  @OneToOne((type) => UserEntity, (user) => user.afreecaId)
  @Column({ primary: true })
  afreecaId!: string;

  @Column()
  logo!: string;

  @Column({ nullable: false })
  refreshToken!: string;

  // ex) 저라뎃
  @Column()
  afreecaStreamerName!: string;
}
