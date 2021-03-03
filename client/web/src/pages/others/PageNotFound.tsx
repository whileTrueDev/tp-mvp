import { Container, Grid, Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';

import Appbar from '../../organisms/shared/Appbar';
import Footer from '../../organisms/shared/footer/Footer';
import styles from '../../organisms/mainpage/main/style/ProductHero.style';

export default function PageNotFound(): JSX.Element {
  const classes = styles();
  const history = useHistory();
  const [second, setSecond] = useState<number>(5);
  useEffect(() => {
    const interval = setInterval(() => {
      setSecond((prevSec) => prevSec - 1);
    }, 1000);
    return () => {
      clearTimeout(interval);
    };
  }, []);

  if (second === 0) {
    history.push('/');
  }

  return (
    <div>
      <Appbar />
      <section>
        <div className={classes.root}>
          <Container>
            <Grid container direction="row" justify="center" alignItems="center">
              <Grid item md={9} sm={12} xs={12} className={classes.wraper}>
                <div className={classes.main}>
                  <h1 className={classes.mainTitle}>존재하지 않는 페이지입니다</h1>
                </div>
                <div className={classes.main}>
                  <p className={classes.mainContent}>{`${second}초 후 메인페이지로 이동합니다`}</p>
                  <p className={classes.mainContent}>아래 버튼을 누르면 바로 메인페이지로 이동합니다</p>
                </div>
                <div className={classes.mainExcept}>
                  <Button
                    className={classes.button}
                    component={Link}
                    to="/"
                  >
                    홈페이지로 이동
                  </Button>
                  <div className={classes.buttonLine} />
                </div>
              </Grid>
              <Grid item md={3} className={classes.imgWraper}>
                <img src="/images/main/heromain.svg" alt="HeroMain" className={classes.mainSVGEffect} />
                <img src="/images/main/herosub.svg" alt="HeroSub" className={classes.subSVGEffect} />
              </Grid>
            </Grid>
          </Container>
        </div>
      </section>
      <Footer />
    </div>
  );
}
