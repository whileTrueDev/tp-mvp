require('dotenv').config();
require('./collectors/afreeca-collector')()
// .then(require('./collectors/twitch-collector'))
// .then(require('./collectors/youtube-collector'))
  .then(() => {
    console.log(`stream-collector end | ${new Date().toLocaleString()}`);
    process.exit(0);
  });
