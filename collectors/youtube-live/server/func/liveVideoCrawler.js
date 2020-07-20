// 크롤러를 이용한 VideoId  in live 조회.
// DB의 creatorId에 대한 채널 초기화면 크롤링 후, videoId 추가하여 return.
// Input format  : [ { type : 'creatorId' | 'creatorName' , value : string } ... ]
// Output format : [ { creatorId, videoId } ... ]
const cheerio = require("cheerio");
const puppeteer = require('puppeteer');

// 라이브인 비디오 수집기
const getVideo = async (item, page, liveVideoDatas) => {
  const {type, value} = item;
  const url = type === 'creatorId' ? `https://www.youtube.com/channel/${value}` : `https://www.youtube.com/user/${value}`;
  await page.goto(url);

  const row = await page.$("ytd-app ytd-item-section-renderer #contents");
  const videoList = await row.$$eval( "ytd-video-renderer", videos => videos.map(video => video.outerHTML));

  if(videoList.length != 0) {
    videoList.map((video)=>{
      const $ = cheerio.load( video );
      const videoId = $('#thumbnail').attr('href').substring(9); 
      liveVideoDatas.push({videoId,  channelId: value});
    })
  }
};

const getLiveVideo = async (dbvalues) => {
  console.log(`크롤링을 실시합니다. 시작 시각 : ${new Date().toLocaleString()}`);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // livevideo data 수집 array
  liveVideoDatas = [];
  const forEachPromise = (items, fn) => items.reduce((promise, item) => promise.then(() => fn(item, page, liveVideoDatas)), Promise.resolve());

  return new Promise((resolve, reject) => {
    forEachPromise(dbvalues, getVideo)
      .then(() => {
        console.log(`크롤링을 종료합니다. 시작 시각 : ${new Date().toLocaleString()}`);
        resolve(liveVideoDatas);
      });
  });
};

module.exports = getLiveVideo;

