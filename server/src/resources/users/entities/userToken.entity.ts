import {
  Entity, Column, CreateDateColumn, UpdateDateColumn
} from 'typeorm';

@Entity({ name: 'UserTokens' })
export class UserTokenEntity {
  // For Exclude Decorator
  constructor(partial: Partial<UserTokenEntity>) {
    Object.assign(this, partial);
  }

  @Column({ primary: true })
  userId!: string

  @Column('text')
  refreshToken!: string;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
