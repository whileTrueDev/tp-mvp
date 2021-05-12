import { LinearProgress, Typography } from '@material-ui/core';
import React, { useMemo } from 'react';
import { useProgressBar, useTopTenList } from '../style/TopTenList.style';

const MIN = 0;
interface Props{
  score: number;
  max?: number;
}
function ScoreBar(props: Props): JSX.Element {
  const { score, max = 10 } = props;
  const progressBarStyles = useProgressBar();
  const classes = useTopTenList();
  /**
 * 0 ~ 100 사이의 숫자를 MIN ~ MAX사이의 숫자로 변환하는 함수
 * 점수는 0~10의 값으로 들어오고, 
 * LinearProgress에서는 0~100사이의 값이 필요하므로 변환 필요
 * @param value 0~100 사이의 숫자
 * @returns MIN~MAX 사이로 변환된 값
 */
  const normalizedScore = useMemo(() => (
    Number((((score - MIN) * 100) / (max - MIN) || 0).toFixed(2))
  ), [max, score]);
  return (
    <div>
      <LinearProgress
        variant="determinate"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={score}
        valueBuffer={max}
        classes={progressBarStyles}
        value={Math.min(100, normalizedScore)}
      />
      {score && (
      <Typography
        component="span"
        className={classes.scoreText}
        style={{
          transform: `translateX(${(10 - score) * (-10)}%`,
        }}
      >
        {score ? `${Math.min(10, Number(score.toFixed(2)))}` : 0}
      </Typography>
      )}

    </div>

  );
}

export default ScoreBar;
