import React from 'react';
import { Container, Button, Grid } from '@material-ui/core';
import { Link } from 'react-router-dom';
import shortid from 'shortid';
import styles from '../style/ProductHero.style';
import source from '../source/textsource';
// CBT 이후 추가될 내용
// import Dialog from '../../../../atoms/Dialog/Dialog';
// import useDialog from '../../../../utils/hooks/useDialog';

interface ProductHeroProps {
  pageIn: string
}

export default function ProductHero(
  { pageIn }: ProductHeroProps,
): JSX.Element {
  const classes = styles();

  // CBT 이후 추가될 내용
  // const { open, handleClose, handleOpen } = useDialog();
  return (
    <div className={classes.root}>
      <Container>
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item md={8} sm={12} xs={12} className={classes.wraper}>
            <div className={classes.main}>
              { ((pageIn === 'main') ? source.productHero : source.cbtHero).title.split('\n').map((row) => (
                <h1 key={shortid.generate()} className={classes.mainTitle}>{row}</h1>
              ))}
            </div>
            <div className={classes.main}>
              {((pageIn === 'main') ? source.productHero : source.cbtHero).content.split('\n').map((row) => (
                <p key={shortid.generate()} className={classes.mainContent}>{row}</p>
              ))}
            </div>
            <div className={classes.mainExcept}>
              <Button
                className={classes.button}
                component={Link}
                to={pageIn === 'main' ? '/infoCBT' : '/'}
              >
                {pageIn === 'main' ? 'CBT신청하기' : '홈페이지로 이동' }
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
      {/* CBT 이후 추가될 내용 */}
      {/* <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
      >
        <div>
          자세히보기 다이얼로그 내용, 자세히보기 다이얼로그 내용,자세히보기 다이얼로그 내용,자세히보기 다이얼로그 내용
        </div>
      </Dialog> */}
    </div>
  );
}
