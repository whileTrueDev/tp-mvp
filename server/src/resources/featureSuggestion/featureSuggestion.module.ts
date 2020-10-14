import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureSuggestionController } from './featureSuggestion.controller';
import { FeatureSuggestionService } from './featureSuggestion.service';
import { FeatureSuggestionEntity } from './entities/featureSuggestion.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    FeatureSuggestionEntity,
  ]),
  ],
  providers: [FeatureSuggestionService],
  controllers: [FeatureSuggestionController],
  exports: [FeatureSuggestionService],
})
export class FeatureModule { }
