import React from 'react';
import { Container, Button } from '@material-ui/core';
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
      <Container className={classes.wraper}>
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
          <div className={classes.logoEffect} />
        </div>
      </Container>
      <Dialog
        open={open}
        onClose={handleClose}
        title="자세히 보기 다이얼로그"
        maxWidth="md"
        buttons={(
          <div>
            <Button onClick={handleClose}>
              취소
            </Button>
          </div>
        )}
      >
        <div>
          자세히보기 다이얼로그 내용, 자세히보기 다이얼로그 내용,자세히보기 다이얼로그 내용,자세히보기 다이얼로그 내용
        </div>
      </Dialog>
    </div>
  );
}
