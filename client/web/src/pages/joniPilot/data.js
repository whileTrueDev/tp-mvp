// function makeRandomColor() {
//   return Math.floor(Math.random() * 16777215).toString(16);
// }

// function getRandomDate(from, to) {
//   const fromTime = from.getTime();
//   const toTime = to.getTime();
//   return new Date(fromTime + Math.random() * (toTime - fromTime));
// }
const getSerializedDate = (from, day) => new Date(new Date(from).getTime() - (day * 8.64e+7)).toISOString();
module.exports = () => {
  const data = {
    videos: [],
    comments: [],
    words: [],
    streams: [
      {
        streamId: 'id1',
        startDate: new Date('2020-12-12'),
        endDate: new Date('2020-12-13'),
        creatorId: 'asdf',
        title: 'wstream title',
        platform: 'afreeca',
        airTime: 1234,
        isRemoved: false,
        chatCount: 1,
        smileCount: 2,
        viewer: 3,
      },
      {
        streamId: 'id123',
        startDate: new Date('2020-12-13'),
        endDate: new Date('2020-12-14'),
        creatorId: 'asd1111f',
        title: 'wstre11am title',
        platform: 'twitch',
        airTime: 122234,
        isRemoved: false,
        chatCount: 123,
        smileCount: 2,
        viewer: 3,
      },
      {
        streamId: 'id12223',
        startDate: new Date('2020-12-12'),
        endDate: new Date('2020-12-13'),
        creatorId: 'asd123f',
        title: 'wstream ti2222tle',
        platform: 'youtube',
        airTime: 12323334,
        isRemoved: false,
        smileCount: 2123,
        chatCount: 1,
        viewer: 3,
      },
    ],
  };

  /**
    platform: 'afreeca' | 'youtube' | 'twitch';
    airTime: number;
    startDate: Date;
    endDate: Date;
    creatorId: string;
    smileCount: number;
    viewer: number;
    chatCount: number;
    needAnalysis: boolean;
   */
  for (let i = 0; i < 50; i += 1) {
    const videoItem = {
      streamId: `streamId-${i}`,
      title: `BLACKPINK - ${i}`,
      platform: ['afreeca', 'youtube', 'twitch'][i % 3],
      startDate: getSerializedDate(new Date(), i + 1),
      endDate: getSerializedDate(new Date(), i),
      creatorId: 'creator-1',
      smileCount: i * 100,
      viewer: i * 100,
      chatCount: i * 100,
      needAnalysis: false,
      // thumbnail: `https://dummyimage.com/100x100/${makeRandomColor()}/fff&text=dummy`,
      thumbnail: `https://img.youtube.com/vi/${i % 2 === 0 ? 'CyqctquwO3Y' : 'kvJoIpjoY-0'}`,
      views: 10000000 - (i * 33333),
      likes: (i) * 10000,
      hates: (i) * 100,
      rating: Math.floor(Math.random() * 5),
      tags: ['블랙핑크', '블핑', 'k-pop', 'yg'],
      comments: 1000,
    };
    data.videos.push(videoItem);
  }

  // for (let i = 0; i < 100; i += 1) {
  //   const commentItem = {
  //     id: i,
  //     date: generateRandomDOB(),
  //     user: {
  //       avatarImage: `https://dummyimage.com/50x50/${makeRandomColor()}/fff&text=${i}`,
  //       nickname: `user-${i}`,
  //     },
  //     likes: Math.floor(Math.random() * 10000000000),
  //     hates: Math.floor(Math.random() * 10000000000),
  //     videoId: Math.floor(Math.random() * 30),
  //   };
  //   data.comments.push(commentItem);
  // }
  return data;
};
