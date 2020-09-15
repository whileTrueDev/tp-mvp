import React from 'react';
import Button from '@material-ui/core/IconButton';
import { makeStyles, Theme } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    marginTop: 500,
    position: 'fixed',
    marginLeft: 1300,
    zIndex: 6
  }
}));

function moveToTalk() {
  window.location.href = 'https://www.google.com';
}

function KakaoTalk(): JSX.Element {
  const classes = useStyles();
  return (
    <Button className={classes.root} onClick={moveToTalk}>
      <img src="/images/favicon/kakaoIcon.png" alt="kakao" width="50" height="50" />
    </Button>
  );
}
export default KakaoTalk;
