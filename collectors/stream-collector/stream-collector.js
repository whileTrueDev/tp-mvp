/* eslint-disable */
require('dotenv').config();
const scheduler = require('node-schedule');
scheduler.scheduleJob('*/5 * * * *', ()=>{
  require('./collectors/afreeca-collector')()
  .then(require('./collectors/twitch-collector'))
  .then(require('./collectors/youtube-collector'))
  .then(() => {
    console.log(`stream-collector end | ${new Date().toLocaleString()}`);
  });
})

// docker run --init --cap-add=SYS_ADMIN --name youtube-crawler -d -v /etc/localtime:/etc/localtime:ro --env-file ./.env youtube-crawler:2.1
