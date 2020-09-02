export interface TruepointSecret {
  database: TruepointDbSecret;
}

export interface TruepointDbSecret {
  password: string;
  engine: 'mysql' | 'mariadb';
  port: number;
  host: string;
  username: string;
}
