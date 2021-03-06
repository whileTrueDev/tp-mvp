/* eslint-disable */
require('dotenv').config();
const scheduler = require('node-schedule');

scheduler.scheduleJob('*/5 * * * *', ()=>{
  require('./collectors/twitch-collector')()
  .then(require('./collectors/afreeca-collector'))
  .then(require('./collectors/youtube-collector'))
  .then(() => {
    console.log(`stream-collector end | ${new Date().toLocaleString()}`);
  });
})
