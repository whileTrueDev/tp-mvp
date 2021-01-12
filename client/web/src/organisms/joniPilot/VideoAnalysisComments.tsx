import React from 'react';
import { Select, MenuItem } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import ChannelAnalysisSectionLayout from './ChannelAnalysisSectionLayout';
import CommentWordCloud from './VideoAnalysisCommentWordCloud';

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
      <CommentWordCloud />
    </ChannelAnalysisSectionLayout>
  );
}
