import React from 'react';
import {
  Card, CardContent,
  Avatar, Grid, Typography,
} from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

const BorderLinearProgress = withStyles((theme) => ({
  root: {
    height: 5,
    borderRadius: 5,
  },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: theme.palette.secondary.main,
  },
}))(LinearProgress);

const TruepointRating = withStyles((theme) => ({
  iconFilled: {
    color: theme.palette.secondary.main,
  },
  iconHover: {
    color: theme.palette.primary.dark
  }
}))(Rating);

export default function UserMetrics(): JSX.Element {
  return (
    <>
      <Grid container spacing={2} style={{ height: 250, marginBottom: 32 }}>
        <Grid item xs={3} container direction="column" alignItems="center">
          <Avatar src="https://avatars0.githubusercontent.com/u/42171155?s=400&u=72c333c5e2c44b64b16b7fef5670182c523d4c96&v=4" style={{ width: 150, height: 150, margin: 32 }} />
          <TruepointRating name="read-only" readOnly value={0.5} precision={0.5} />
        </Grid>

        <Grid item xs={9} container direction="column" alignItems="center">
          <Typography variant="h1">그래프가</Typography>
          <Typography variant="h1">위치할 예정</Typography>
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        {[1233, 2516, 3434, 45454].map((card) => (
          <Grid item xs={3} key={card}>
            <Card>
              <div style={{ padding: 16 }}>
                <Typography variant="h6">평균시청자</Typography>
              </div>
              <div style={{ padding: 8 }}>
                <BorderLinearProgress variant="determinate" value={50} />
              </div>
              <CardContent>
                <Typography variant="h6" style={{ fontWeight: 'bold' }}>{card}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <div style={{ marginTop: 16, marginBottom: 32 }}>
          <Typography variant="caption">* 통계 데이터는 시청자 50명, 구독자 500명 이상의 사용자를 기준으로 하며, 최근 일주일간의 데이터로 랭킹을 산정합니다.</Typography>
        </div>
      </Grid>
    </>
  );
}
