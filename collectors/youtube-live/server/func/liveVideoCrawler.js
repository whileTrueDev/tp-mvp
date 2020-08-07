// 크롤러를 이용한 VideoId  in live 조회.
// DB의 creatorId에 대한 채널 초기화면 크롤링 후, videoId 추가하여 return.
// Input format  : [ { type : 'creatorId' | 'creatorName' , value : string } ... ]
// Output format : [ { creatorId, videoId } ... ]
const cheerio = require("cheerio");
const puppeteer = require('puppeteer');

// 라이브인 비디오 수집기
// 해당 페이지에서 가져올 수 있는 데이터를 모두 수집한다.
const getVideo = async (item, page, liveVideoDatas) => {
  const {type, value} = item;
  const url = type === 'creatorId' ? `https://www.youtube.com/channel/${value}` : `https://www.youtube.com/user/${value}`;
  await page.goto(url);

  const row = await page.$("ytd-app ytd-item-section-renderer #contents");
  
  //row가 없을 수도 있다... => error handling을 해야하지만 딱히 의미는 없을 것으로 보인다..
  const videoList = await row.$$eval( "ytd-video-renderer", videos => videos.map(video => video.outerHTML));

  if(videoList.length != 0) {
    videoList.map((video)=>{
      const $ = cheerio.load( video );
      const videoId = $('#thumbnail').attr('href').substring(9); 
      const videoTitle = $('#video-title').attr('title');
      const channelName2 = $('#channel-name #text-container #text a').text();
      liveVideoDatas.push({videoId, videoTitle, channelId: value, channelName : channelName2.substring(0, channelName2.length / 2 )});
    })
  }
};

const getLiveVideo = async (dbvalues) => {
  console.log(`crawling start : ${new Date().toLocaleString()}`);
  // const browser = await puppeteer.launch({
  //   args: ['--disable-dev-shm-usage']
  // }); //할당된 메모리를 최대한 사용하게 함.
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setDefaultNavigationTimeout(0);  // 성능이 좋지 않은 환경에서 delay 발생할 경우, 페이지 로딩까지 기다리게함.

  // livevideo data 수집 array
  liveVideoDatas = [];
  const forEachPromise = (items, fn) => items.reduce((promise, item) => promise.then(() => fn(item, page, liveVideoDatas)), Promise.resolve());

  return new Promise((resolve, reject) => {
    forEachPromise(dbvalues, getVideo)
      .then(async () => {
        await page.close();
        await browser.close();
        console.log(`crawling end, channels on air : ${liveVideoDatas.length} | ${new Date().toLocaleString()}`);
        resolve(liveVideoDatas);
      });
  });
};

module.exports = getLiveVideo;
