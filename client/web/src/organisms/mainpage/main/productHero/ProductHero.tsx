import React from 'react';
import { Container, Grid } from '@material-ui/core';
import shortid from 'shortid';
import styles from '../style/ProductHero.style';
import source from '../source/textsource';
import useMediaSize from '../../../../utils/hooks/useMediaSize';
import { MAX_WIDTH_DESKTOP } from '../../../../assets/constants';
// CBT 이후 추가될 내용
// import Dialog from '../../../../atoms/Dialog/Dialog';
// import useDialog from '../../../../utils/hooks/useDialog';

export default function ProductHero(): JSX.Element {
  const classes = styles();
  const { isMobile } = useMediaSize();

  // CBT 이후 추가될 내용
  // const { open, handleClose, handleOpen } = useDialog();
  return (
    <div className={classes.root}>
      <Container style={{ maxWidth: MAX_WIDTH_DESKTOP }}>
        <Grid
          container
          direction={isMobile ? 'column-reverse' : 'row'}
          justify="center"
          alignItems="center"
        >
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
            <img src="/images/main/main_tv.png" alt="tv" />
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
