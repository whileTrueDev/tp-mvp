import mysql from 'mysql';

export default function createConnectionPool(config: any): mysql.Pool {
  const connectionPool = mysql.createPool({
    host: config.host,
    port: config.port,
    user: config.username,
    password: config.password,
    database: config.dbname,
    charset: 'utf8mb4',
  });
  return connectionPool;
}
