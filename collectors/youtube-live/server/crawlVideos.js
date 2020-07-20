// 크롤러를 이용하여 해당 채널의 
// infinity scrolling이므로 list의 갯수를 통해 분기를 결정한다.
//  scrolling을 무한 반복 => 데이터 수집.
require('dotenv').config(); // 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.
const cheerio = require("cheerio");
const puppeteer = require('puppeteer');
const doQuery = require('./model/calculatorQuery');

async function pageDown(page){
  await page.evaluate(async () => {
      await new Promise((resolve, reject) => {
          var totalHeight = 0;
          var distance = 2400;
          var timer = setInterval(() => {
              var scrollHeight = document.body.scrollHeight;
              window.scrollBy(0, distance);
              totalHeight += distance;

              if(totalHeight >= scrollHeight){
                  clearInterval(timer);
                  resolve();
              }
          }, 10000);
      });
  });
}

// 라이브인 비디오 수집기
const getVideo = async (item, page) => {
  const liveVideoDatas = [];
  const {type, value} = item;
  const url =  `https://www.youtube.com/channel/${value}/videos`;
  try{
    await page.goto(url);
    await page.setViewport({
        width: 1200,
        height: 1200
    });

    await page.evaluate(async () => {
      window.scrollBy(0, 1500);
      var timer = setInterval(() => {
      },10000);
    });

    // infinite scrolling을 위한
    let max_length = -1;
    let row;
    let videoList = [];
    while(max_length <= videoList.length){
      row = await page.$("ytd-app ytd-item-section-renderer #contents ytd-grid-renderer");
      videoList = await row.$$eval( "ytd-grid-video-renderer", videos => videos.map(video => video.outerHTML));
      if(max_length  === videoList.length){
        break;
      }
      max_length = videoList.length;
      // console.log(max_length);
      await pageDown(page);
    }
    console.log("크롤링 중간 종료");
    if(videoList.length != 0) {
      videoList.map((video)=>{
        const $ = cheerio.load( video );
        const videoId = $('#thumbnail').attr('href').substring(9); 
        console.log(videoId);
        if(videoId !== undefined){
          liveVideoDatas.push({videoId,  channelId: value});
        }
      })
      // db 저장하기.  => liveVideoDatas클리어하기.
      await InsertOldVideo(liveVideoDatas);
    }
  }catch(error){
    console.log(error);
  }
};

// not live => live가 된 video로 DB에 적재한다.
const InsertOldVideo = (newLiveVideos) => {
  if(newLiveVideos.length == 0) {
    return Promise.resolve();
  }

  const rawQuery = newLiveVideos.reduce((str, {channelId, videoId})=>{
    return str + `( '${videoId}' , '${channelId}'),`;
  },'');
  const conditionQuery = rawQuery.slice(0,-1) + ';';

  const InsertQuery = 
  `
  INSERT INTO youtubeOldVideos
  (videoId, channelId)
  VALUES ${conditionQuery};
  `;

  return new Promise((resolve, reject)=>{
      doQuery(InsertQuery, [])
        .then(()=>{
          resolve();
        })
        .catch((error)=>{
          reject({
              error: true,
              func : "InsertNewVideo",
              msg : error
          });
        })
  });
}

const getLiveVideo = async (dbvalues) => {
  console.log(`크롤링을 실시합니다. 시작 시각 : ${new Date().toLocaleString()}`);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const forEachPromise = (items, fn) => items.reduce((promise, item) => promise.then(() => fn(item, page)), Promise.resolve());

  return new Promise((resolve, reject) => {
    forEachPromise(dbvalues, getVideo)
      .then(async () => {
        console.log(`크롤링을 종료합니다. 시작 시각 : ${new Date().toLocaleString()}`);
        await browser.close();
      });
  });
};

// module.exports = getLiveVideo;

const dbvalues = [
  // { type: 'creatorId', value: 'UC-Bsa2ivAGWq7bsSPrPGFVA' },
  { type: 'creatorId', value: 'UC9KQaCA_EMobJUxZszQ4wlg' },
  { type: 'creatorId', value: 'UCRY0vKmqFmQ4XCJomWMBf-w' },
  { type: 'creatorId', value: 'UCZXWb_78BrkjpsLHv2bJhUw' },
  { type: 'creatorId', value: 'UCmTjMP2tpOFoFIuKzb4uEhw' },
  { type: 'creatorId', value: 'UCybKp0O2N9sUZOgIm1j2r_w' },
  { type: 'creatorId', value: 'UCfdLDnGcRM3okEOtocWNHuQ' },
  { type: 'creatorId', value: 'UCiCNc3uj8Bnc9bDzHJS058Q' },
  { type: 'creatorId', value: 'UCaS8sePfGIHBU1R6uz04d0g' },
  { type: 'creatorId', value: 'UC2NFRq9s2neD_Ml0tPhNC2Q' },
  { type: 'creatorId', value: 'UCghP93LBNk1EGBr5gFJg20Q' },
  { type: 'creatorId', value: 'UC0-ZCUCeCQBwKU15x0Aqk_g' },
  { type: 'creatorId', value: 'UCY74n-XQJ69dxNdN7h71wLg' },
  { type: 'creatorId', value: 'UCarjMZCmwGZWZwshJXDnA5w' },
  { type: 'creatorId', value: 'UCoYFo-lRD3pchMUtsBcEbOA' },
  { type: 'creatorId', value: 'UCnXe6v0-5vmMMRU2qx0XwUw' },
  { type: 'creatorId', value: 'UCRNq4G2anQUfkvBZWrKYIqw' },
  { type: 'creatorId', value: 'UCHysRIIDpEywTmWl44ZV5Dw' },
  { type: 'creatorId', value: 'UCHe08MV-b1IWnsqRijJj5JQ' },
  { type: 'creatorId', value: 'UCi6QE2TWQ1OWEX1o5TPSz1g' },
  { type: 'creatorId', value: 'UC81LbS19aG9DG7qGyeNEBtA' },
  { type: 'creatorId', value: 'UCHQcF_yN5QSDYAnXb5vaXcg' },
  { type: 'creatorId', value: 'UCkd3KAYGnTNPJZZrPOFeWhA' },
  { type: 'creatorId', value: 'UC2untV6RHYn-FMJe1JZyi-g' },
];

getLiveVideo(dbvalues);