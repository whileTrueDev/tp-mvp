import React from 'react';
import Grid from '@material-ui/core/Grid';
import { Typography } from '@material-ui/core';
import Card from '../../../atoms/Card/Card';
import useHighlightAnalysisHeroStyles from '../layouts/HighlightAnalysisHero.style';

export default function HighlightAnalysisHero(): JSX.Element {
  const classes = useHighlightAnalysisHeroStyles();
  return (
    <div>
      <Grid
        container
        direction="row"
        justify="center"
        alignItems="center"
        spacing={3}
        className={classes.paper}
      >
        <Grid item xs={3}>
          <Card className={classes.leftCard}>
            <Typography className={classes.fonts} variant="body1">
              분석 대시보드
            </Typography>
            <div className={classes.image}>
              <img src="/images/analyticsPage/balloon.png" width="15%" alt="말풍선" />
            </div>
            <Typography variant="h5" className={classes.fonts}>
              채팅 발생 수
              <br />
              분석차트
            </Typography>
            <Typography className={classes.fonts} variant="body2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis modi eveniet reprehenderit eius similique eum vitae sed velit,
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card className={classes.middleCard}>
            <Typography className={classes.fonts} variant="body1">
              분석 대시보드
            </Typography>
            <div className={classes.image}>
              <img src="/images/analyticsPage/smile.png" width="15%" alt="스마일" />
            </div>
            <Typography variant="h5" className={classes.fonts}>
              웃음 발생 수
              <br />
              분석차트
            </Typography>
            <Typography className={classes.fonts} variant="body2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis modi eveniet reprehenderit eius similique eum vitae sed velit,
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={3}>
          <Card className={classes.rightCard}>
            <Typography className={classes.fonts} variant="body1">
              분석 대시보드
            </Typography>
            <div className={classes.image}>
              <img src="/images/analyticsPage/magnify.png" width="15%" alt="돋보기" />
            </div>
            <Typography variant="h5" className={classes.fonts}>
              단어 검색 및
              <br />
              분석차트
            </Typography>
            <Typography className={classes.fonts} variant="body2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis modi eveniet reprehenderit eius similique eum vitae sed velit,
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
