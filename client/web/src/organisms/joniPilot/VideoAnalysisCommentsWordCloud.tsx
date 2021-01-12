import React from 'react';
import { Container } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import ReactWordcloud, { MinMaxPair, Word } from 'react-wordcloud';
import 'tippy.js/dist/tippy.css';
import { getWordColorInBlue } from './tempWordsData';

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
  getWordColor: getWordColorInBlue,
};

const useWordCloudStyle = makeStyles((theme: Theme) => createStyles({
  container: {
    padding: theme.spacing(2),
    maxHeight: '600px',
  },
}));

interface CommentWordCloudPropType extends Record<string, any>{
  words: Word[];
}
export default function CommentWordCloud(props: CommentWordCloudPropType): JSX.Element {
  const { words } = props;
  const classes = useWordCloudStyle();

  return (
    <Container className={classes.container}>
      <ReactWordcloud
        callbacks={callbacks}
        options={options}
        words={words}
      />
    </Container>
  );
}
