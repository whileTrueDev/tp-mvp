import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureController } from './feature.controller';
import { FeatureService } from './feature.service';
import { FeatureEntity } from './entities/feature.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    FeatureEntity,
  ]),
  ],
  providers: [FeatureService],
  controllers: [FeatureController],
  exports: [FeatureService]
})
export class FeatureModule { }
