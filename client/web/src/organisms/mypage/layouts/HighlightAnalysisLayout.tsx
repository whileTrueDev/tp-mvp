import React from 'react';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Divider from '@material-ui/core/Divider';

import Calendar from '../highlightAnalysis/Calendar';
import Button from '../../../atoms/Button/Button';
import Card from '../../../atoms/Card/Card';
import useHighlightAnalysisLayoutStyles from './HighlightAnalysisLayout.style';

interface StreamDate {
  startAt: Date,
  finishAt: Date,
  streamId: string
}

export default function HighlightAnalysisLayout(): JSX.Element {
  const classes = useHighlightAnalysisLayoutStyles();
  const data: StreamDate = {
    startAt: new Date(),
    finishAt: new Date(),
    streamId: ''
  };
  const [selectedStream, setSelectedStream] = React.useState(data);
  const [isClicked, setIsClicked] = React.useState(false);
  const handleDatePick = async (startAt: Date, finishAt: Date, streamId: string, e: any) => {
    setSelectedStream({
      startAt,
      finishAt,
      streamId
    });
  };
  const handleAnalyze = () => {
    setIsClicked(true);
  };

  return (
    <Grid
      container
      direction="column"
    >
      <Paper className={classes.root}>
        <Grid item className={classes.root}>
          <Grid item xs={3}>
            <Divider variant="middle" component="hr" />
          </Grid>
          <Typography variant="h4" className={classes.title}>
            편집점 분석
          </Typography>
          <Typography variant="body1" className={classes.sub}>
            방송을 선택하시면 편집점 분석을 시작합니다.
          </Typography>
          <Divider variant="middle" />
        </Grid>
        <Grid
          container
          direction="row"
          alignItems="center"
        >
          <Grid item className={classes.root}>
            <Typography variant="h4" className={classes.checkedStreamFont}>
              선택된 방송 &gt;
            </Typography>
          </Grid>
          <Grid item>
            {selectedStream.streamId
              ? (
                <Card className={classes.card}>
                  <Typography className={classes.cardText}>
                    {`${`${String(selectedStream.startAt.getDate())}일  
                ${selectedStream.startAt.getHours()}:${selectedStream.startAt.getMinutes()}`}
                 ~ 
                 ${String(selectedStream.startAt.getDate())}일  ${`${selectedStream.finishAt.getHours()}:${selectedStream.finishAt.getMinutes()}`}`}
                  </Typography>
                </Card>
              ) : (null)}
          </Grid>
        </Grid>
        <Grid
          container
          direction="row"
          justify="flex-end"
          alignItems="flex-end"
        >
          <Grid item xs={9} className={classes.root}>
            <Calendar
              handleDatePick={handleDatePick}
              selectedStream={selectedStream}
            />
          </Grid>
          <Grid item xs={3}>
            <div>
              <Button
                onClick={handleAnalyze}
                disabled={isClicked || Boolean(!selectedStream.streamId)}
              >
                분석하기
              </Button>
            </div>
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}
