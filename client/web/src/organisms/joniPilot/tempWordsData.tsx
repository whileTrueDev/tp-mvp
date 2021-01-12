import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import { Word } from 'react-wordcloud';

// 테스트 위한 임시 단어 목록과 색 배열
const MAXVAL = 20;
const RED = Object.values(red).slice(0, 10);
const BLUE = Object.values(blue).slice(0, 10);

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

const getWordColorInBlue = (word: Word): string => {
  // 긍정단어 파란색, 부정단어 붉은색 매칭
  // const colorBase = word.type === 'positive' ? BLUE : RED;
  const colorBase = BLUE;
  const index = Number(Math.floor((word.value / MAXVAL) * (colorBase.length - 1)));
  return colorBase[index];
};

export {
  MAXVAL, BLUE, RED, positiveWords, negativeWords, getWordColorInBlue,
};
