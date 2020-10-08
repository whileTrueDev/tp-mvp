import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NoticeEntity } from './entities/notice.entity';
import { NoticeController } from './notice.controller';
import { NoticeService } from './notice.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      NoticeEntity,
    ])
  ],
  controllers: [NoticeController],
  providers: [NoticeService]
})
export class NoticeModule {}
