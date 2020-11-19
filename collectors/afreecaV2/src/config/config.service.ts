import dotenv from 'dotenv';
import { Dict } from '../interfaces/Dict.interface';

export class ConfigService {
  private secrets: Dict<string>;

  public config<T extends Dict<string>>(): T {
    try {
      dotenv.config();
    } catch {
      console.error('Error occured during load configurations');
      process.exit(1);
    }

    const { env } = process;
    this.secrets = env;
    return env as T;
  }

  public getValue(key: string): string | undefined {
    if (Object.keys(this.secrets).includes(key)) {
      return this.secrets[key];
    }
    return undefined;
  }
}
