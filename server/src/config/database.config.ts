import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TruepointDbSecret } from '../interfaces/Secrets.interface';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private readonly configService: ConfigService) { }

  createTypeOrmOptions(): TypeOrmModuleOptions {
    const database = this.configService.get<TruepointDbSecret>('database');

    return {
      type: database.engine,
      host: database.host,
      port: database.port,
      username: database.username,
      password: database.password,
      database: 'TruepointDev',
      timezone: 'Asia/Seoul',
      synchronize: true,
      autoLoadEntities: true,
    };
  }
}
