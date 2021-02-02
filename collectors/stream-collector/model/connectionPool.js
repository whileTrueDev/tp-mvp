/* eslint-disable */

const mysql = require('mysql');

const collectorPool = mysql.createPool({
  host: process.env.COLLECTOR_DB_HOST,
  user: process.env.COLLECTOR_DB_USER,
  password: process.env.COLLECTOR_DB_PASSWORD,
  database: process.env.COLLECTOR_DB_DATABASE,
  port: process.env.COLLECTOR_DB_PORT,
  /**
     * The maximum number of connection requests the pool will queue
     * before returning an error from getConnection.
     * If set to 0, there is no limit to the number of queued connection requests. (Default: 0)
     */
});

// 2021-02-02 dev, production 환경에 따른 분기처리
const truepointProdPool = mysql.createPool({
  host: process.env.TP_DB_HOST,
  user: process.env.TP_DB_USER,
  password: process.env.TP_DB_PASSWORD,
  database: process.env.TP_DB_DATABASE,
  port: process.env.TP_DB_PORT,
  /**
     * The maximum number of connection requests the pool will queue
     * before returning an error from getConnection.
     * If set to 0, there is no limit to the number of queued connection requests. (Default: 0)
     */
});

// 2021-02-02 dev, production 환경에 따른 분기처리
const truepointDevPool = mysql.createPool({
  host: process.env.TP_DB_DEV_HOST,
  user: process.env.TP_DB_DEV_USER,
  password: process.env.TP_DB_DEV_PASSWORD,
  database: process.env.TP_DB_DEV_DATABASE,
  port: process.env.TP_DB_DEV_PORT,
  /**
     * The maximum number of connection requests the pool will queue
     * before returning an error from getConnection.
     * If set to 0, there is no limit to the number of queued connection requests. (Default: 0)
     */
});

const truepointPool = process.env.ENV_TYPE === 'production' ? truepointProdPool : truepointDevPool;
console.log('create pools!');

module.exports = {collectorPool, truepointPool};
