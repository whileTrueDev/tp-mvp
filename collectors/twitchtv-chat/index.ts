import dotenv from 'dotenv';

import Bot from './chat/twitchBot';

dotenv.config();

const onad = new Bot();
onad.run();
