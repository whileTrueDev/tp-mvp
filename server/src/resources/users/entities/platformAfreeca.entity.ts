import { Entity, Column, OneToOne, } from 'typeorm';
import { UserEntity } from './user.entity';

@Entity({ name: 'PlatformAfreeca' })
export class PlatformAfreecaEntity {
  @OneToOne((type) => UserEntity, (user) => user.afreecaId)
  @Column({ primary: true })
  afreecaId!: string;

  @Column({ length: 200 })
  logo!: string;

  @Column({ nullable: false })
  refreshToken!: string;

  // ex) 저라뎃
  @Column()
  afreecaStreamerName!: string;
}
