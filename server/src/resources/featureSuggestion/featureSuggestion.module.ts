import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeatureSuggestionController } from './featureSuggestion.controller';
import { FeatureSuggestionService } from './featureSuggestion.service';
import { FeatureSuggestionEntity } from './entities/featureSuggestion.entity';
import { FeatureSuggestionReplyService } from './featureSuggestionReply.service';
import { FeatureSuggestionReplyEntity } from './entities/featureSuggestionReply.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    FeatureSuggestionEntity,
    FeatureSuggestionReplyEntity,
  ]),
  ],
  providers: [FeatureSuggestionService, FeatureSuggestionReplyService],
  controllers: [FeatureSuggestionController],
  exports: [FeatureSuggestionService],
})
export class FeatureModule { }
