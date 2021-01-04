function makeRandomColor() {
  return Math.floor(Math.random() * 16777215).toString(16);
}

function getRandomDate(from, to) {
  const fromTime = from.getTime();
  const toTime = to.getTime();
  return new Date(fromTime + Math.random() * (toTime - fromTime));
}

const generateRandomDOB = () => getRandomDate(new Date('2020-01-01'), new Date());
const getSerializedDate = (from, day) => new Date(new Date(from).getTime() - (day * 8.64e+7));
module.exports = () => {
  const data = {
    videos: [],
    comments: [],
    words: [],
  };

  for (let i = 0; i < 30; i += 1) {
    const videoItem = {
      id: i,
      title: `BLACKPINK - ${i}`,
      date: getSerializedDate('2021-01-04', i).toISOString().split('T')[0],
      thumbnail: `https://dummyimage.com/100x100/${makeRandomColor()}/fff&text=dummy`,
      // views: Math.floor(Math.random() * 10000000000),
      views: (i + 1) * 1000,
      likes: (i + 1) * 10000,
      hates: (i + 1) * 100,
      rating: Math.floor(Math.random() * 5),
      tags: ['블랙핑크', '블핑', 'k-pop', 'yg'],
      comments: [],
    };
    data.videos.push(videoItem);
  }

  for (let i = 0; i < 100; i += 1) {
    const commentItem = {
      id: i,
      date: generateRandomDOB(),
      user: {
        avatarImage: `https://dummyimage.com/50x50/${makeRandomColor()}/fff&text=${i}`,
        nickname: `user-${i}`,
      },
      likes: Math.floor(Math.random() * 10000000000),
      hates: Math.floor(Math.random() * 10000000000),
      videoId: Math.floor(Math.random() * 30),
    };
    data.comments.push(commentItem);
  }
  return data;
};
