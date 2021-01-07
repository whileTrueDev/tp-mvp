function makeRandomColor() {
  return Math.floor(Math.random() * 16777215).toString(16);
}

function getRandomDate(from, to) {
  const fromTime = from.getTime();
  const toTime = to.getTime();
  return new Date(fromTime + Math.random() * (toTime - fromTime));
}
const getSerializedDate = (from, day) => new Date(new Date(from).getTime() - (day * 8.64e+7)).toISOString();
module.exports = () => {
  const data = {
    videos: [],
    mostPopularComments: [],
    mostPopularReplies: [],
    mostSmiledComments: [],
    feedbackComments: [],
    words: [],
  };

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
      thumbnail: `https://img.youtube.com/vi/${i % 2 === 0 ? 'CyqctquwO3Y' : 'kvJoIpjoY-0'}`,
      views: 10000000 - (i * 33333),
      likes: (i + 1) * 143,
      hates: (i + 2) * 87,
      rating: Math.floor(Math.random() * 5),
      tags: ['블랙핑크', '블핑', 'k-pop', 'yg'],
      comments: 1000,
    };
    data.videos.push(videoItem);
  }

  for (let i = 0; i < 5; i += 1) {
    const commentItem = {
      commentId: `comment-${i}`,
      commentText: '',
      streamId: `stream-${i}`,
      createdAt: getRandomDate(new Date(new Date().getTime() - (i * 8.64e+7)), new Date()),
      userId: `user-${i}`,
      nickname: `user-nickname-${i}`,
      profileImage: `https://dummyimage.com/50x50/${makeRandomColor()}/fff&text=${i}`,
      likes: Math.floor(Math.random() * 100000),
      hates: Math.floor(Math.random() * 10000),
      replies: Math.floor(Math.random() * 30),
    };
    data.mostPopularComments.push({ ...commentItem, commentText: `가장 인기 많은 댓글 ${i}` });
    data.mostPopularReplies.push({ ...commentItem, commentText: `가장 인기 많은 대댓글 ${i}` });
    data.mostSmiledComments.push({ ...commentItem, commentText: `웃음 많은 댓글 ${i}` });
    data.feedbackComments.push({ ...commentItem, commentText: `피드백 댓글 ${i}` });
  }
  return data;
};
