var express = require('express');
const { default: Axios } = require('axios');
var router = express.Router();
const axios = require('axios');

/* GET access_token */
router.get('/', function(req, res, next) {
  console.log(req.body);
  
  // req.code 영역에 대해 오류가 발생할 수 있다.
  // 임시인증 코드
  const temporaryCertificationCode = req.query.code;
  const client_id = '399272991402-kkk433ftq9i2eeno7ntmtsq26kmtnc5e.apps.googleusercontent.com';
  const client_secret = 'SHWRH8rNHSwt2qxOpgkrLfgr';
  const redirect_uri = 'http://localhost:3000/callback';
  console.log(req.query.code);
  
  //  post에 데이터 붙여넣기
  axios.post(`https://accounts.google.com/o/oauth2/token`, {
    code: temporaryCertificationCode,
    client_id, 
    client_secret,
    redirect_uri,
    grant_type: 'authorization_code'
  })
  .then((res)=>{
    const tokens = res.data;
    console.log(tokens.access_token);
  })
  .catch((e)=>{
    console.log(e);
  });

  // get header넣기 
  res.send('respond with a resource');
});

module.exports = router;
