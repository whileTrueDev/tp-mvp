import { Grid, Typography } from '@material-ui/core';
import React from 'react';
import styles from '../../organisms/mainpage/main/style/ProductHero.style';

export default function UpdatingPage(): JSX.Element {
  const classes = styles();
  return (
    <Grid container direction="column" style={{ width: '100vw', height: '100vh', backgroundColor: '#f29551' }} justify="center" alignItems="center">
      <img src="/images/logo/logo_truepoint_v2_allwhite.png" alt="logo" />
      <br />
      <Typography variant="h3">업데이트 중입니다</Typography>
      <br />
      <img src="/images/main/heromain.svg" alt="HeroMain" width="320" height="170" className={classes.mainSVGEffect} />
    </Grid>
  );
}
