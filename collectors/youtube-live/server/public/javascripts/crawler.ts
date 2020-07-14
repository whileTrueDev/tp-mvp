import axios from "axios";

// 1. Youtube의 Creator들에 대한 정보를 제공받는다.
interface target {
  type: "creatorId" | "creatorName",
  value: string //creatorId, creatorName의 실제값.
}

//환경변수로 들어가야할 변수들
const API_KEY = 'AIzaSyD5wdcdgFPAAsYyVkvFcHrB-De2vZtjk_8';

// 모든요청을 Request화하여 map으로 돌릴 때는 
const repeater = (data: any[], func: (any) => Promise<any>) => {
  return new Promise((resolve, reject) => {
    Promise.all([
      data.map((element) => func(element))
    ])
      .then((result) => {
        // 존재하지 않는 값에 대한 전처리.
        console.log(result);

      })
      .catch((error) => {
        console.log(error);
        reject(error);
      })
  })
}

// 하나의 ID에 대한 조회 => id를 return 한다.
const getCreatorId = (param: target) => {
  const { type, value } = param;
  return new Promise<any>((resolve, reject) => {
    if (type === 'creatorId') {
      resolve(value);
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
            resolve(id);
          }
        })
        .catch((err) => {
          reject(err.response.message);
        })
    }
  })
}

const getCreatorIDs = (targets: target[]) => {
  //저장하지 않고 API로 즉시 요청
  return targets.reduce((acc: string[], { type, value }: target) => {
    if (type === 'creatorId') {
      acc.push(value);
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
            acc.push(id);
          }
        })
    }
    return acc;
  }, []);
}

// 요청횟수를 줄이기 위해서 반드시 작업이 필요할듯하다.

// 지속적인 API 요청을 통해 확인해야한다.
const getLiveVideoIDs = (targets: string[]) => {
  //저장하지 않고 API로 즉시 요청
  return targets.reduce((acc: string[], target: string) => {
    const url = `https://www.googleapis.com/youtube/v3/search`;
    const params = {
      part: 'id',
      channelId: target,
      eventType: 'live',
      order: 'date',
      type: 'video',
      key: API_KEY
    }
    axios.get(url, { params })
      .then((row) => {
        if (row.status !== 200) {
          console.log("에러발생");
          return;
        }
        if (row.data.hasOwnProperty('items') && row.data.items.length != 0) {
          // console.log(row.data);
          const { id } = row.data.items[0];
          const { videoId } = id;
          console.log(videoId);
          // id를 DB에 존재여부 확인 후, 추가하는 방향으로
          acc.push(videoId);
        }
      })
      .catch((error) => {
        console.log(error.response.data);
      })
    return acc;
  }, []);
}

// activeLiveChatId을 수집하는 함수
const getLiveChatId = (targets: string[]) => {
  const url = `https://www.googleapis.com/youtube/v3/videos`;
  const ids = targets.reduce((acc, target, index) => {
    return (index == 0 ? target : acc + ',' + target);
  }, '');
  const params = {
    part: 'liveStreamingDetails',
    id: ids,
    key: API_KEY
  }
  axios.get(url, { params })
    .then((row) => {
      if (row.status !== 200) {
        console.log("에러발생");
        return;
      }
      // console.log(row.data);
      if (row.data.hasOwnProperty('items') && row.data.items.length != 0) {
        row.data.items.forEach((element) => {
          const details = element.liveStreamingDetails;
          console.log(details);
          // const activeLiveChatId = details.hasOwnProperty('activeLiveChatId') ? details.activeLiveChatId : null;
          // return activeLiveChatId;
          // console.log(activeLiveChatId);
        })
      }
    })
    .catch((error) => {
      console.log(error);
    })
}



// const livevideos = getLiveVideoIDs(channelIds);

const channelIds = [
  'UCXqlds5f7B2OOs9vQuevl4A',
  'UC8pqDEzjWIqWFHH_0mqcuZw',
  'UCXsbYbgwmk_zbTTdwCn_1Ig'
]

const videoIds = [
  'C8Lz245oi_8',
  'Q7O3QJMl61E',
  'JcZK810_ap8'
]


repeater(channelIds, getCreatorId);


// getLiveChatId(videoIds);