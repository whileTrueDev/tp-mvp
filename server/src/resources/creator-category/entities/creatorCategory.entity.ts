import {
  Entity, Column, PrimaryGeneratedColumn, ManyToMany,
  // ManyToMany,
} from 'typeorm';
import { CreatorCategory } from '@truepoint/shared/dist/interfaces/CreatorCategory.interface';
import { PlatformAfreecaEntity } from '../../users/entities/platformAfreeca.entity';
import { PlatformTwitchEntity } from '../../users/entities/platformTwitch.entity';

@Entity({ name: 'CreatorCategoryTest' })
export class CreatorCategoryEntity implements CreatorCategory {
  constructor(partial: Partial<CreatorCategoryEntity>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  categoryId: number;

  @Column()
  name: string;

  @ManyToMany((type) => PlatformAfreecaEntity, (afreecaCreator) => afreecaCreator.categories)
  afreecaCreator?: PlatformAfreecaEntity[];

  @ManyToMany((type) => PlatformTwitchEntity, (twitchCreator) => twitchCreator.categories)
  twitchCreator?: PlatformTwitchEntity[];
}
