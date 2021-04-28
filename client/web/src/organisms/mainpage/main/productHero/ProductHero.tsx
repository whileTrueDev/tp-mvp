import React from 'react';
import { Container, Grid } from '@material-ui/core';
import shortid from 'shortid';
import styles from '../style/ProductHero.style';
import source from '../source/textsource';
// CBT 이후 추가될 내용
// import Dialog from '../../../../atoms/Dialog/Dialog';
// import useDialog from '../../../../utils/hooks/useDialog';

export default function ProductHero(): JSX.Element {
  const classes = styles();

  // CBT 이후 추가될 내용
  // const { open, handleClose, handleOpen } = useDialog();
  return (
    <div className={classes.root}>
      <Container>
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item md={8} sm={12} xs={12} className={classes.wraper}>
            <div className={classes.main}>
              { source.productHero.title.split('\n').map((row) => (
                <h1 key={shortid.generate()} className={classes.mainTitle}>{row}</h1>
              ))}
            </div>
            <div className={classes.main}>
              {source.productHero.content.split('\n').map((row) => (
                <p key={shortid.generate()} className={classes.mainContent}>{row}</p>
              ))}
            </div>
          </Grid>
          <Grid item md={4} className={classes.imgWraper}>
            <img src="/images/main/main_tv_small.png" alt="small tv" className="small-tv" />
            <div className="large-tv-wrapper">
              <img className="large-tv" src="/images/main/main_tv_large.png" alt="large tv" />
              <img className="logo-in-tv" src="/images/logo/logo_truepoint_v2_light.png" alt="logo" />
            </div>
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
