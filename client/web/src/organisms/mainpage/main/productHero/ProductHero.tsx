import React from 'react';
import { Container, Button, Grid } from '@material-ui/core';
import shortid from 'shortid';
import styles from '../style/ProductHero.style';
import source from '../source/textsource';
import Dialog from '../../../../atoms/Dialog/Dialog';
import useDialog from '../../../../utils/hooks/useDialog';

export default function ProductHero(): JSX.Element {
  const classes = styles();
  const { open, handleClose, handleOpen } = useDialog();
  return (
    <div className={classes.root}>
      <Container>
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item md={8} className={classes.wraper}>
            <div className={classes.main}>
              {source.productHero.title.split('\n').map((row) => (
                <h1 key={shortid.generate()} className={classes.mainTitle}>{row}</h1>
              ))}
            </div>
            <div className={classes.main}>
              {source.productHero.content.split('\n').map((row) => (
                <p key={shortid.generate()} className={classes.mainContent}>{row}</p>
              ))}
            </div>
            <div className={classes.mainExcept}>
              <Button className={classes.button} onClick={handleOpen}>
                자세히 보기
              </Button>
              <div className={classes.buttonLine} />
            </div>
          </Grid>
          <Grid item md={4} className={classes.imgWraper}>
            <img src="/images/main/heromain.svg" alt="HeroMain" className={classes.mainSVGEffect} />
            <img src="/images/main/herosub.svg" alt="HeroSub" className={classes.subSVGEffect} />
          </Grid>
        </Grid>
      </Container>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
      >
        <div>
          자세히보기 다이얼로그 내용, 자세히보기 다이얼로그 내용,자세히보기 다이얼로그 내용,자세히보기 다이얼로그 내용
        </div>
      </Dialog>
    </div>
  );
}
