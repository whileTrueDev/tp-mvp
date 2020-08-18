import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CatsModule } from './resources/cats/cats.module';
import { AuthModule } from './resources/auth/auth.module';
import { UsersModule } from './resources/users/users.module';

const OurTypeOrmModule = TypeOrmModule.forRoot({
  type: 'mysql',
  host: 'database-1.cmsx9pc0wbnp.ap-northeast-2.rds.amazonaws.com',
  port: 3306,
  username: 'admin',
  password: 'rkdghktn12',
  database: 'test',
  autoLoadEntities: true,
  synchronize: true
});

@Module({
  imports: [
    OurTypeOrmModule,
    CatsModule,
    AuthModule,
    UsersModule
  ],
})
export class AppModule {}
