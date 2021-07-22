import { Grid, LinearProgress, Typography } from '@material-ui/core';
import React, { useMemo } from 'react';
import { useProgressBar, useTopTenList } from '../style/TopTenList.style';

const MIN = 0;

function getRankLabel({ total, scoreRank }: {
  total: number | undefined,
  scoreRank: number | undefined
}): string | null {
  if (!total || !scoreRank) return null;

  const percentile = Math.round((scoreRank / total) * 100);

  if (scoreRank < 20) return `랭킹 ${scoreRank}위`;
  if (percentile < 30) return `상위 ${percentile}%`;
  if (percentile > 70) return '거의 없는 편';

  return '평범한 편';
}
interface Props{
  score: number;
  total?: number;
  scoreRank?: number;
  max?: number;
}
function ScoreBar(props: Props): JSX.Element {
  const {
    score, max = 10, total, scoreRank,
  } = props;
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

  const rankLabel = getRankLabel({ total, scoreRank });

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
      <Grid container justify="space-between">
        {score && (
        <Typography
          component="span"
          className={classes.scoreText}
        >
          {score ? `${Math.min(10, Number(score.toFixed(2)))}` : 0}
        </Typography>
        )}
        { rankLabel && (
        <Typography component="span" style={{ fontSize: '14px' }}>
          {rankLabel}
        </Typography>
        )}
      </Grid>

    </div>

  );
}

export default ScoreBar;
