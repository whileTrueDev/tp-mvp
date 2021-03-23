import { LinearProgress } from '@material-ui/core';
import React from 'react';
import { useProgressBar } from '../style/TopTenList.style';

const MIN = 0;
const MAX = 10;
const normalize = (value: number): number => ((value - MIN) * 100) / (MAX - MIN);

function ScoreBar({ score }: {score: number}): JSX.Element {
  const progressBarStyles = useProgressBar();
  return (
    <LinearProgress
      variant="determinate"
      aria-valuemin={0}
      aria-valuemax={10}
      aria-valuenow={score}
      valueBuffer={10}
      classes={progressBarStyles}
      value={normalize(score)}
    />
  );
}

export default ScoreBar;
