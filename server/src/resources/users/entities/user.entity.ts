import { Entity, Column, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { CatEntity } from '../../cats/entities/cat.entity';

@Entity({ name: 'User' })
export class UserEntity {
  @Column({ primary: true })
  id?: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive?: boolean;

  // The ClassSerializerInterceptor interceptor uses the powerful class-transformer package
  // to provide a declarative and extensible way of transforming objects
  // it can apply rules expressed by class-transformer decorators on an entity/DTO class
  // like this
  @Exclude()
  @Column()
  password: string;

  @OneToMany((type) => CatEntity, (cat) => cat.owner)
  cats?: CatEntity[]

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
