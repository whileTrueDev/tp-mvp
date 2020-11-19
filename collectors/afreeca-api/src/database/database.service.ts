import { Connection, createConnection } from 'typeorm';
import { DatabaseConfigService } from '../config/database.config';

export class DatabaseService {
  connection: Connection;

  constructor(
    private databaseConfigService: DatabaseConfigService,
  ) {}

  private async connect(): Promise<void> {
    const option = await this.databaseConfigService.getOptions();
    this.connection = await createConnection(option);
  }

  public async init(): Promise<void> {
    await this.connect();
    console.error('Database connection initialization success !!');
  }
}
