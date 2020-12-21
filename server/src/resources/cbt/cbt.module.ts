import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CbtInquiryEntity } from '../cbtinquiry/entities/cbtinquiry.entity';
import { PlatformAfreecaEntity } from '../users/entities/platformAfreeca.entity';
import { UserEntity } from '../users/entities/user.entity';
import { CbtController } from './cbt.controller';
import { CbtService } from './cbt.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CbtInquiryEntity,
      UserEntity,
      PlatformAfreecaEntity,
    ]),
  ],
  controllers: [CbtController],
  providers: [CbtService],
})
export class CbtModule {}
