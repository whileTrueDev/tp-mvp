export interface DbSecret {
  password: string;
  engine: 'mysql' | 'mariadb';
  port: number;
  host: string;
  username: string;
  dbname: string;
}

export interface TruepointDbSecret {
  database: DbSecret;
}

export interface CollectorDbSecret {
  WhileTrueCollectorDB: DbSecret;
}
