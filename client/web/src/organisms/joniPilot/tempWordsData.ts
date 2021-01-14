interface Word extends Record<string, any>{
text: string;
value: number;
}
// 테스트 위한 임시 단어 목록
const MAXVAL = 100; // 최대 value

const words = ['유투브', '구독', '예술', '좋아요', '좋아요 반사', 'ㅋㅋㅋ', '뭔데ㅋㅋ', '와', 'ㅁㅁ', '미쳤다', '역시', '코로나', '방송', '룰루', '랄라', '아프리카', '트위치', '큐넷', '정미조', '나스닥', '이수민', '배진웅', '삼성전자', '토트넘', '스포츠', '모모랜드', '공매도', '코스피', '넷마블', '저기근데', '서순좀', '제발', '진짜', '지연', '마이충'];
const positive = words.slice(0, Math.floor(words.length / 2));
const negative = words.slice(Math.floor(words.length / 2), words.length - 1);
function makeWordsData(wordsList: string[], type = 'positive') {
  return wordsList.map((word) => ({
    text: word,
    value: Math.ceil(Math.random() * MAXVAL),
    type,
  }));
}
const positiveWords: Word[] = makeWordsData(positive, 'positive');
const negativeWords: Word[] = makeWordsData(negative, 'negative');

export {
  positiveWords, negativeWords,
};
