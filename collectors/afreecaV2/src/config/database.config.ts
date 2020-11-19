import { ConnectionOptions } from 'typeorm';
import { ConfigService } from './config.service';

export class DatabaseConfigService {
  constructor(private configService: ConfigService) {}

  public getOptions(): ConnectionOptions {
    const DB_HOST = this.configService.getValue('DB_HOST');
    const DB_USER = this.configService.getValue('DB_USER');
    const DB_PASSWORD = this.configService.getValue('DB_PASSWORD');
    const DB_DATABASE = this.configService.getValue('DB_DATABASE');
    const DB_CHARSET = this.configService.getValue('DB_CHARSET');
    const DB_PORT = this.configService.getValue('DB_PORT');

    return {
      type: 'mysql',
      host: DB_HOST,
      port: Number(DB_PORT),
      username: DB_USER,
      password: DB_PASSWORD,
      database: DB_DATABASE,
      charset: DB_CHARSET,
      timezone: 'Asia/Seoul',
      synchronize: true,
      entities: ['**/*.entity.ts', '**/*.entity.js'],
    };
  }
}
