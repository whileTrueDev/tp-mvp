import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Cat' })
export class CatEntity {
  @PrimaryGeneratedColumn()
  id?: number;

  @Column()
  name: string;

  @Column()
  age: number;

  @Column()
  breed: string;

  @Column()
  owner: string;
}
