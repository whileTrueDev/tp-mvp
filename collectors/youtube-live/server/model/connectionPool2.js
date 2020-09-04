const mysql = require('mysql');
const dbConfig = require('./dbConfig');

// not error handling
console.log('create pool!');

module.exports = async () => {
  const config = await dbConfig();
  return mysql.createPool({
    host: config.host,
    user: config.username,
    password: config.password,
    database: config.dbname,
    port: config.port,
    /**
       * The maximum number of connection requests the pool will queue
       * before returning an error from getConnection.
       * If set to 0, there is no limit to the number of queued connection requests. (Default: 0)
       */
  });
};
  