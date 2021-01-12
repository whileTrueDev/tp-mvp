import React from 'react';
import { Container } from '@material-ui/core';
import red from '@material-ui/core/colors/red';
import blue from '@material-ui/core/colors/blue';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import ReactWordcloud, { MinMaxPair, Word } from 'react-wordcloud';
import 'tippy.js/dist/tippy.css';

// 테스트 위한 임시 단어 목록과 색 배열
const MAXVAL = 20;
const RED = Object.values(red).slice(0, 10);
const BLUE = Object.values(blue).slice(0, 10);

const words = ['유투브', '구독', '예술', '좋아요', '좋아요 반사', 'ㅋㅋㅋ', '뭔데ㅋㅋ', '와', 'ㅁㅁ', '미쳤다', '역시', '코로나', '방송', '룰루', '랄라', '아프리카', '트위치', '큐넷', '정미조', '나스닥', '이수민', '배진웅', '삼성전자', '토트넘', '스포츠', '모모랜드', '공매도', '코스피', '넷마블', '저기근데', '서순좀', '제발', '진짜', '지연', '마이충'];
const positiveWords = words.slice(0, Math.floor(words.length / 2));
const negativeWords = words.slice(Math.floor(words.length / 2), words.length - 1);
function makeWordsData(wordsList: string[], type = 'positive') {
  return wordsList.map((word) => ({
    text: word,
    value: Math.ceil(Math.random() * MAXVAL),
    type,
  }));
}
const positive: Word[] = makeWordsData(positiveWords, 'positive');
const negative: Word[] = makeWordsData(negativeWords, 'negative');

// 리렌더링 막기 위해 wordcloud 옵션은 컴포넌트 외부에 선언한다
// Scale, Spiral, MinMaxPair 타입은 리터럴 숫자배열([10,10])이나 문자('sqrt')로 쓰면 타입에러가 난다
// https://react-wordcloud.netlify.app/faq#typescript-errors
const options = {
  rotationAngles: [0, 90] as MinMaxPair,
  rotations: 0,
  deterministic: true,
  scale: 'sqrt' as const,
  fontSizes: [16, 100] as MinMaxPair,
  padding: 3,
  enableOptimizations: true,
};

const callbacks = {
  // getWordTooltip: (word: Word) => {}, // 전체 단어 중 해당 단어가 차지하는 비율 표현
  getWordColor: (word: Word) => {
    // 긍정단어 파란색, 부정단어 붉은색 매칭
    // const colorBase = word.type === 'positive' ? BLUE : RED;
    const colorBase = BLUE;
    const index = Number(Math.floor((word.value / MAXVAL) * (colorBase.length - 1)));
    return colorBase[index];
  },
};

const useWordCloudStyle = makeStyles((theme: Theme) => createStyles({
  container: {
    padding: theme.spacing(2),
    maxHeight: '500px',
  },
}));
export default function CommentWordCloud(): JSX.Element {
  const classes = useWordCloudStyle();

  return (
    <Container className={classes.container}>
      <ReactWordcloud
        callbacks={callbacks}
        options={options}
        words={[...positive, ...negative]}
      />
    </Container>
  );
}
