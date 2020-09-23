import React, { useState } from 'react';
import classnames from 'classnames';
import {
  Card, CardContent,
  Avatar, Grid, Typography, Grow
} from '@material-ui/core';
import { Rating } from '@material-ui/lab';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import VisibilityIcon from '@material-ui/icons/Visibility';
import ChartExample from './ChartExample';

const BorderLinearProgress = withStyles((theme) => ({
  root: { height: 5, borderRadius: 5, },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: theme.palette.secondary.main,
  },
}))(LinearProgress);

const TruepointRating = withStyles((theme) => ({
  icon: { color: theme.palette.common.white },
  iconFilled: { color: theme.palette.secondary.main, },
  iconHover: { color: theme.palette.secondary.light },
}))(Rating);

const useStyles = makeStyles((theme) => ({
  card: {
    cursor: 'pointer',
    transition: '0.1s linear all',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: theme.shadows[10]
    }
  },
  selected: {
    transition: '0.1s linear all',
  }
}));

export default function UserMetrics(): JSX.Element {
  const classes = useStyles();
  const [selectedCard, setSelectedCard] = useState<number>(0);
  function handleCardClick(cardindex: number) {
    setSelectedCard(cardindex);
  }
  return (
    <>
      <Grid container spacing={2} style={{ marginBottom: 32 }} alignItems="center">
        <Grid item xs={3} container direction="column" alignItems="center">
          <Avatar
            src="https://avatars0.githubusercontent.com/u/42171155?s=400&u=72c333c5e2c44b64b16b7fef5670182c523d4c96&v=4"
            style={{ width: 150, height: 150, margin: '32px 32px 16px 32px' }}
          />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TruepointRating
              name="read-only"
              value={0.5}
              precision={0.5}
            />
            <Typography variant="h6" style={{ fontWeight: 'bold', color: 'white' }}>0.5</Typography>
          </div>
        </Grid>

        <Grid item xs={9} container direction="column" alignItems="center">
          <ChartExample />
        </Grid>

        <Grid item xs={12} container spacing={2} style={{ marginTop: 32 }}>
          {[1233, 2516, 3434, 45454].map((card, index) => (
            <Grid item xs={3} key={card}>
              <Card
                className={classnames({
                  [classes.card]: selectedCard !== index,
                  [classes.selected]: selectedCard === index
                })}
                onClick={() => { handleCardClick(index); }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 16px' }}>
                  <Typography variant="h6">평균시청자</Typography>
                  {selectedCard === index && (
                    <Grow in>
                      <VisibilityIcon color="primary" />
                    </Grow>
                  )}
                </div>
                <div style={{ padding: '0px 16px' }}>
                  <BorderLinearProgress variant="determinate" value={50} />
                </div>
                <CardContent style={{ padding: '8px 16px', marginBottom: 32 }}>
                  <Typography variant="h5" style={{ fontWeight: 900, lineHeight: 1.43 }}>{card.toLocaleString()}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}

          <div style={{ marginTop: 16, marginBottom: 32 }}>
            <Typography variant="caption">* 통계 데이터는 시청자 50명, 구독자 500명 이상의 사용자를 기준으로 하며, 최근 일주일간의 데이터로 랭킹을 산정합니다.</Typography>
          </div>
        </Grid>
      </Grid>
    </>
  );
}
