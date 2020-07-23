// python으로 구현된 crawler를 js화
require('dotenv').config(); // 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.
const cheerio = require("cheerio");
const puppeteer = require('puppeteer');
const doQuery = require('../model/calculatorQuery');




// 라이브인 비디오 수집기
const getVideo = (videoid, page) => {

  return new Promise(async (resolve, reject)=> {
    const url =  `http://www.youtube.com/watch?v=${videoid}`;
    try{
      await page.goto(url);
      await page.setViewport({
          width: 1920,
          height: 1080
      });
      
      await page.evaluate(async () => {
        var timer = setInterval(() => {
        },10000);
      });

      // const channelName = await page.$$eval("yt-simple-endpoint style-scope yt-formatted-string", e => e.outerHTML);
      // console.log(channelName);
      const $ = cheerio.load( page );
      console.log($.html());
      

      // const row = $("#scriptTag");
      // console.log(row);
      

      // // const liveInfo = await page.$eval("#scriptTag", e => e.outerHTML);
      // console.log(liveInfo)
      // console.log(channelName)

      resolve();
    }catch(error){
      console.log(error);
      reject(error);
    }
  })


  
    


    

    // await ;
    // // infinite scrolling을 위한
    // let max_length = -1;
    // let row;
    // let videoList = [];
    // while(max_length <= videoList.length){
    //   row = await page.$("ytd-app ytd-item-section-renderer #contents ytd-grid-renderer");
    //   videoList = await row.$$eval( "ytd-grid-video-renderer", videos => videos.map(video => video.outerHTML));
    //   if(max_length  === videoList.length){
    //     break;
    //   }
    //   max_length = videoList.length;
    //   // console.log(max_length);
    //   await pageDown(page);
    // }
    // console.log("크롤링 중간 종료");
    // if(videoList.length != 0) {
    //   videoList.map((video)=>{
    //     const $ = cheerio.load( video );
    //     const videoId = $('#thumbnail').attr('href').substring(9); 
    //     console.log(videoId);
    //     if(videoId !== undefined){
    //       liveVideoDatas.push({videoId,  channelId: value});
    //     }
    //   })
    //   // db 저장하기.  => liveVideoDatas클리어하기.
    //   await InsertOldVideo(liveVideoDatas);
    // }
 
};

const main = async () => {
  console.log(`크롤링을 실시합니다. 시작 시각 : ${new Date().toLocaleString()}`);
  const option = {
    args : ['--headless', '--window-size=1920x1080', '--disable-gpu', '--lang=ko_KR']
  };
  const browser = await puppeteer.launch(option);
  const page = await browser.newPage();

  // const forEachPromise = (items, fn) => items.reduce((promise, item) => promise.then(() => fn(item, page)), Promise.resolve());

  // return new Promise((resolve, reject) => {
  //   forEachPromise(dbvalues, getVideo)
  //     .then(async () => {
  //       console.log(`크롤링을 종료합니다. 시작 시각 : ${new Date().toLocaleString()}`);
  //       await browser.close();
  //     });
  // });
  // await ;
  getVideo('7qqJxDcgERc', page)
  .then(()=>{
    browser.close();
  })
  // await 

};


main();