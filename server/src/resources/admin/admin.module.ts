import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { NotificationEntity } from '../notification/entities/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    NotificationEntity,
  ])],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
