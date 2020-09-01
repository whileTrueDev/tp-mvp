// 크롤러를 이용한 VideoId  in live 조회.
// DB의 creatorId에 대한 채널 초기화면 크롤링 후, videoId 추가하여 return.
// Input format  : [ { type : 'creatorId' | 'creatorName' , value : string } ... ]
// Output format : [ { creatorId, videoId } ... ]
const cheerio = require("cheerio");

// 라이브인 비디오 수집기
// 해당 페이지에서 가져올 수 있는 데이터를 모두 수집한다.
const getVideo = async (item, page, liveVideoDatas) => {
  const {type, value} = item;
  const url = type === 'creatorId' ? `https://www.youtube.com/channel/${value}` : `https://www.youtube.com/user/${value}`;
  await page.goto(url);

  return new Promise((resolve, reject)=>{
    page.$("ytd-app ytd-item-section-renderer #contents")
    .then((row)=> row.$$eval( "ytd-video-renderer", videos => videos.map(video => video.outerHTML)))
    .then((videoList)=>{
       // 여기서 문제가 생겼다.... => 없는 것에서 문제가 생긴 듯 하다. => liveChatId는 있는데 videoId가
      if(videoList.length != 0) {
        videoList.map((video)=>{
          const $ = cheerio.load( video );
          const videoId = $('#thumbnail').attr('href').substring(9); 
          const videoTitle = $('#video-title').attr('title').replace(/\\/g, '').replace(/\'/g, ' ');
          const channelName2 = $('#channel-name #text-container #text a').text();
          liveVideoDatas.push({videoId, videoTitle, channelId: value, channelName : channelName2.substring(0, channelName2.length / 2 )});
        })
      }
      resolve();
    })
    .catch((error)=>{
      console.log(url);
      console.log(error);
      resolve();
    })
  });
};

const getLiveVideo = async (dbvalues, page) => {
  const liveVideoDatas = [];
  const forEachPromise = (items, fn) => items.reduce((promise, item) => promise.then(() => fn(item, page, liveVideoDatas)), Promise.resolve());

  return new Promise((resolve, reject) => {
    forEachPromise(dbvalues, getVideo)
      .then(() => {
        resolve(liveVideoDatas);
      });
  });
};

module.exports = getLiveVideo;
