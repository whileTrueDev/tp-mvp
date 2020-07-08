const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {

  // 계정 권한 요청 URL 만들기
  const base_url = 'https://accounts.google.com/o/oauth2/v2/auth';
  const client_id = '399272991402-kkk433ftq9i2eeno7ntmtsq26kmtnc5e.apps.googleusercontent.com';
  const scope  = `email+profile+https://www.googleapis.com/auth/youtube+https://www.googleapis.com/auth/yt-analytics.readonly`;
  const redirect_uri = `http://localhost:3000/callback`;
  res.redirect( base_url + `?client_id=${client_id}&response_type=code&scope=${scope}&redirect_uri=${redirect_uri}&include_granted_scopes=true&prompt=consent`);
});

module.exports = router;
