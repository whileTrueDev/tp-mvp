export interface TruepointDbSecret {
  password: string;
  engine: 'mysql' | 'mariadb';
  port: number;
  host: string;
  username: string;
  dbname: string;
}

export interface TruepointSecret {
  database: TruepointDbSecret;
}
