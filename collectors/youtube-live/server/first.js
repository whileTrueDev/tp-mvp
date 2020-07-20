require('dotenv').config(); // 환경변수를 위해. dev환경: .env 파일 / production환경: docker run의 --env-file인자로 넘김.
const axios =  require("axios");
const doQuery = require('./model/calculatorQuery');
const { doTransacQuery } = require('./model/doQuery');
const dbvalues = require('./data');

// 1. Youtube의 Creator들에 대한 정보를 제공받는다.
// interface target {
//   type: "creatorId" | "creatorName",
//   value: string //creatorId, creatorName의 실제값.
// }

// 각 순서마다 전달되는 데이터의 형태
// const returnValue = 
// {
//  error : false, // true | false,
//   msg
//   data
// }

//환경변수로 들어가야할 변수들
const API_KEY = 'AIzaSyD5wdcdgFPAAsYyVkvFcHrB-De2vZtjk_8';

// 모든요청을 Request화하여 map으로 돌릴 때는 
const repeater = (data, func) => {
  return new Promise((resolve, reject) => {
    Promise.all(
      data.map((element) => func(element))
    )
      .then((result) => {
        // 존재하지 않는 값에 대한 전처리.
        const output = result.reduce((arr, element)=>{
           if(!element.error){
             arr.push(element.data);
           }else{
            // error의 type을 관찰하기 위해  
             console.log(element.msg);
           }
          return arr;
          }, []);
        resolve(output);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      })
  })
}

// 하나의 ID에 대한 조회 => id를 return 한다.
const getCreatorId = (target) => {
  const { type, value } = target;
  return new Promise((resolve, reject) => {
    if (type === 'creatorId') {
      resolve({
        error : false,
        data : {
          channelId : value,
        },
      });
    } else {
      const url = `https://www.googleapis.com/youtube/v3/channels`;
      const params = {
        part: 'id',
        forUsername: value,
        key: API_KEY
      }
      axios.get(url, { params })
        .then((row) => {
          if (row.data.hasOwnProperty('items')) {
            const { id } = row.data.items[0];
            // id를 DB에 존재여부 확인 후, 추가하는 방향으로 
            resolve({
              error : false,
              data : {
                channelId : id,
              },
            });
          }
          else {
            // 해당 query에 대한 데이터가 존재하지 않는다.
            resolve({
              error: true,
              msg : `${value} has not creator data`
            });
          }
        })
        .catch((err) => {
            resolve({
              error: true,
              msg : err.response.data.error.message
            });
        })
    }
  })
}


// ************************************ 지속적 반복 필요 ***************************************
// 매우 높은 cost의 요청이므로 사용이 불가능하다.
// 하나의 channel ID => video Id in live
const getVideoId = (target) => {
  const { channelId } = target;
  return new Promise((resolve, reject) => {
    const url = `https://www.googleapis.com/youtube/v3/search`;
    const params = {
      part: 'id',
      channelId,
      eventType: 'live',
      order: 'date',
      type: 'video',
      key: API_KEY
    }
    axios.get(url, { params })
      .then((row) => {
        if (row.data.hasOwnProperty('items') && row.data.items.length != 0) {
          const { id } = row.data.items[0];
          const { videoId } = id;
          // id를 DB에 존재여부 확인 후, 추가하는 방향으로 
          resolve({
            error : false,
            data : {
              videoId,
              ...target
            },
          });
        }
        else {
          // 해당 query에 대한 데이터가 존재하지 않는다.
          resolve({
            error: true,
            msg : `${channelId} has not video in live`
          });
        }
      })
      .catch((err) => {
          resolve({
            error: true,
            msg : err.response.data.error.message
          });
      })
  })
}


// repeater(channelIds, getCreatorId)
// .then((step1)=>{
//   console.log(step1);
//   repeater(step1, getVideoId)
//   .then((step2)=>{
//     console.log(step2);
//     getliveChatId(step2);
//   })
// })



const main = async () => {

  

  const step1 = await repeater(dbvalues, getCreatorId);
  console.log(step1);
  // await loadLiveVideo(step1);
}

main();

  