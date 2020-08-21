// 동일 browser이지만, page를 여러개를 사용하여 동시에 작업을 처리할 수 있도록 한다.
const puppeteer = require('puppeteer');
const getVideoByPage = require('./pageCrawler');

// page에 대한 옵션을 추가하기 위해서 promise를 하나 더 감싼 형태... 
// -> 쓸데없이 복잡하긴 함.
const getPage = (browser) => {
  return new Promise((resolve, reject)=> {
    browser
    .newPage()
    .then(async(page)=>{
      await page.setDefaultNavigationTimeout(0); 
      resolve(page);
    })
    .catch((error)=> {
      reject(error);
    })
  })
}

// page당 탐색할 creator list 만들기. 
const divideCreators = (dbvalues, count) => {
  const page_length = Math.ceil(dbvalues.length / count);
  const targetList = [];
  for (let i = 0; i < count;) {
    const targets = dbvalues.splice(0, page_length);
    targetList.push(targets);
    i += 1;
  }
  return targetList;
}

// page별로 데이터 수집하기 + 수집된 데이터 결합하기.
const getLiveVideo = async (dbvalues, count) =>{
  const dividedData = divideCreators(dbvalues, count);
  const browser = await puppeteer.launch();
  
  return new Promise((resolve, reject)=>{ 
    Promise.all(  
      [...Array(count)].map(()=> getPage(browser))
    )
    .then((pages)=> Promise.all(
      pages.map((page, index)=> getVideoByPage(dividedData[index], page))
    ))
    .then(async(datas)=>{
      const result = datas.reduce((arr, streams)=> arr.concat(streams), []);
      await browser.close();
      console.log(`page crawling end, channels on air : ${result.length} | ${new Date().toLocaleString()}`);
      resolve(result);
    })
    .catch((error)=>{
      console.log(error);
      reject(error);
    })
  })
}

module.exports = getLiveVideo;

