import React, { useState, useEffect } from 'react';
import { Select, MenuItem } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import ChannelAnalysisSectionLayout from './ChannelAnalysisSectionLayout';
import AmWordCloud, { Word } from './AmWordCloud';
import SortedBarChart from './SortedBarChart';
import { positiveWords, negativeWords } from './tempWordsData';

const useVideoAnalysisCommentsStyles = makeStyles((theme: Theme) => createStyles({
  selectInputContainer: {
    textAlign: 'right',
  },
  selectInput: {
    padding: theme.spacing(1, 2),
  },
}));
export default function VideoAnalysisComments(): JSX.Element {
  const classes = useVideoAnalysisCommentsStyles();
  const handleSelectInputChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    // set value
  };
  const [posWords, setPosWords] = useState<Word[]>([]);
  const [negWords, setNegWords] = useState<Word[]>([]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setPosWords(positiveWords);
      setNegWords(negativeWords);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, []);
  return (

    <ChannelAnalysisSectionLayout
      title="댓글 분석"
      tooltip="댓글분석~~~"
    >
      <div className={classes.selectInputContainer}>
        <Select
          className={classes.selectInput}
          variant="outlined"
          value={3}
          onChange={handleSelectInputChange}
        >
          <MenuItem value={3}>최근 3일</MenuItem>
          <MenuItem value={7}>최근 7일</MenuItem>
          <MenuItem value={30}>최근 30일</MenuItem>
        </Select>
      </div>
      {/* <AmWordCloud words={[...positiveWords, ...negativeWords]} /> */}
      <AmWordCloud words={[...posWords, ...negWords]} />
      {/* <SortedBarChart negativeWords={negativeWords} positiveWords={positiveWords} /> */}
      <SortedBarChart negativeWords={negWords} positiveWords={posWords} />
    </ChannelAnalysisSectionLayout>
  );
}
