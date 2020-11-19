import { ConnectionOptions } from 'typeorm';
import { ConfigService } from './config.service';

export class DatabaseConfigService {
  constructor(
    private configService: ConfigService,
  ) {
  }

  public async getOptions(): Promise<ConnectionOptions> {
    const baseOptions: ConnectionOptions = {
      type: 'mysql',
      timezone: 'Asia/Seoul',
      entities: ['**/*.entity.ts', '**/*.entity.js'],
      synchronize: true,
      charset: 'utf8mb4',
    };
    const awsDbConfig = await this.configService.getDbSecretsFromAws();
    if (awsDbConfig) {
      return {
        ...baseOptions,
        host: this.configService.getValueFromAws('host'),
        port: Number(this.configService.getValueFromAws('port')),
        username: this.configService.getValueFromAws('username'),
        password: this.configService.getValueFromAws('password'),
        database: this.configService.getValueFromAws('dbname'),
      };
    }
    return {
      ...baseOptions,
      host: this.configService.getValue('DB_HOST'),
      port: Number(this.configService.getValue('DB_PORT')),
      username: this.configService.getValue('DB_USER'),
      password: this.configService.getValue('DB_PASSWORD'),
      database: this.configService.getValue('DB_DATABASE'),
      charset: this.configService.getValue('DB_CHARSET'),
    };
  }
}
