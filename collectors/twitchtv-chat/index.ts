import dotenv from 'dotenv';

import Bot from './chat/twitchBot';
import loadConfig from './config/loadConfig';
import createConnectionPool from './model/createConnectionPool';

dotenv.config();

loadConfig()
  .then((config) => {
    const pool = createConnectionPool(config);
    const onad = new Bot(pool);
    onad.run();
  })
  .catch((err) => {
    console.error(err);
  });
