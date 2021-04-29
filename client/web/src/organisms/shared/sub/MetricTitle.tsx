import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Typography, Grid } from '@material-ui/core';
import SectionTitle from './SectionTitles';

const styles = makeStyles((theme) => ({
  content: {
    fontSize: 22,
    fontWeight: 600,
  },
  logo: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    margin: theme.spacing(4),
  },
  contentWraper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  contentSub: {
    textAlign: 'center',
    width: 500,

    fontSize: 18,
    padding: theme.spacing(2),
    backgroundColor: theme.palette.action.focus,
    borderRadius: 4,
    marginLeft: theme.spacing(4),
  },
  quotes: {
    width: 18,
    height: 18,
    margin: theme.spacing(1),
  },
  point: {

    fontSize: 24,
    fontWeight: 700,
    margin: `0px ${theme.spacing(1)}px`,
  },
  svg: {
    marginLeft: theme.spacing(10),
    width: 20,
    height: 10,
    fill: theme.palette.action.focus,
    stroke: theme.palette.action.focus,
    strokeWidth: '1px',
  },
}));

interface MetricTitleProps {
  mainTitle?: string;
  subTitle: string;
  iconSrc: string;
  pointNumber: number;
}

export default function MetricTitle({
  mainTitle, subTitle, iconSrc, pointNumber,
}: MetricTitleProps): JSX.Element {
  const classes = styles();
  return (
    <Grid item>
      { mainTitle && (
        <SectionTitle mainTitle={mainTitle} />
      )}
      <Grid container direction="row" alignItems="center">
        <Grid item className={classes.logo}>
          <img src={iconSrc} alt="truepointItems" height={70} />
          <Typography variant="body1" className={classes.content}>
            {subTitle}
          </Typography>
        </Grid>
        <Grid item className={classes.contentWraper}>
          <Grid item className={classes.contentSub}>
            <img
              src="/images/analyticsPage/quotesLeft.png"
              alt="quotes"
              className={classes.quotes}
            />
            분석된 하이라이트 포인트는
            <span className={classes.point}>
              {pointNumber}
              개
            </span>
            입니다.
            <img
              src="/images/analyticsPage/quotesRight.png"
              alt="quotes"
              className={classes.quotes}
            />
          </Grid>
          <svg className={classes.svg}>
            <polyline points="0,0 10,10 20,0" />
          </svg>
        </Grid>
      </Grid>
    </Grid>
  );
}
