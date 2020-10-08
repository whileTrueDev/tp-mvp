import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { NoticeEntity } from './entities/notice.entity';
import { NotificationEntity } from './entities/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NoticeEntity, NotificationEntity
  ])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
