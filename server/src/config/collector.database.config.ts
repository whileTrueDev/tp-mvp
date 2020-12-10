import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DbSecret } from '../interfaces/Secrets.interface';

@Injectable()
export class CollectorTypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) { }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const database = this.configService.get<DbSecret>('WhileTrueCollectorDB');

    return {
      name: 'WhileTrueCollectorDB',
      type: database.engine,
      host: database.host,
      port: database.port,
      username: database.username,
      password: database.password,
      database: database.dbname,
      timezone: 'Asia/Seoul',
      entities: [`${__dirname}/../collector-entities/**/*.entity{.ts,.js}`],
    };
  }
}
