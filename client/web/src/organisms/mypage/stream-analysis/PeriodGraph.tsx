import React from 'react';
import {
  Grid, Typography, Card, CardContent,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { PeriodAnalysisResType } from '@truepoint/shared/dist/res/PeriodAnalysisResType.interface';
import TimeLineGraph from '../graph/TimeLineGraph';
// import { timelineInterface } from '../graph/graphsInterface';
import CenterLoading from '../../../atoms/Loading/CenterLoading';

const useStyles = makeStyles((theme) => ({
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  card: {
    width: '100%',
    height: '94px',
    borderRadius: '4px',
    backgroundColor: '#959abb',
    borderWidth: 0,
  },
  main: {
    fontSize: '18px',
    fontWeight: 'normal',
    color: theme.palette.text.primary,
  },
  bold: {
    fontWeight: 'bold',
  },
}));

export default function PeriodAnalysis({ data, loading, selectedMetric }: {
  data: PeriodAnalysisResType; loading: boolean; selectedMetric: string[];
}): JSX.Element {
  const classes = useStyles();

  return (
    <div>
      { loading && (<CenterLoading />)}
      { !loading && (
      <Grid container direction="column" justify="center" spacing={2}>
        <Grid item>
          <TimeLineGraph data={data.value} selectedMetric={selectedMetric} />
        </Grid>
        <Grid item>
          <Card className={classes.card} variant="outlined">
            <CardContent className={classes.center}>
              <Grid container direction="row" justify="center" spacing={1}>
                <Grid item>
                  <Typography className={classes.main}>
                    {data.start_date}
                    {' '}
                    ~
                    {' '}
                    {data.end_date}
                    {' '}
                    기간 동안의
                  </Typography>
                </Grid>
              </Grid>
              <Grid container direction="row" justify="center" spacing={1}>
                <Grid item>
                  <Typography className={classes.main}>
                    평균 시청자 수
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography className={classnames(classes.main, classes.bold)}>
                    {`${data.view_count}명`}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography className={classes.main}>
                    평균 채팅 발생 수
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography className={classnames(classes.main, classes.bold)}>
                    {`${data.chat_count}회`}
                  </Typography>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      )}
    </div>
  );
}
