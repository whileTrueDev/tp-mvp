import { Container, Grid, Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useHistory, Link } from 'react-router-dom';

import Appbar from '../../organisms/shared/Appbar';
import Footer from '../../organisms/shared/footer/Footer';
import styles from '../../organisms/mainpage/main/style/ProductHero.style';
import TruepointLogo from '../../atoms/TruepointLogo';

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
    <Grid container direction="column" justify="space-between" style={{ height: '100vh' }}>
      <Appbar />
      <Container className={classes.root}>
        <Grid container direction="column" justify="center" alignItems="center">
          <Grid item>
            <TruepointLogo />
          </Grid>
          <Grid item>
            <div className={classes.main}>
              <h1 className={classes.mainTitle}>존재하지 않는 페이지입니다</h1>
            </div>
          </Grid>
          <Grid item>
            <div className={classes.main}>
              <p className={classes.mainContent}>{`${second}초 후 메인페이지로 이동합니다`}</p>
              <p className={classes.mainContent}>아래 버튼을 누르면 바로 메인페이지로 이동합니다</p>
            </div>
          </Grid>
          <Grid item>
            <Button
              variant="outlined"
              component={Link}
              to="/"
            >
              홈페이지로 이동
            </Button>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Grid>

  );
}
