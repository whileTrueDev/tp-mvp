import React from 'react';
import Button from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  root: {
    bottom: 60,
    position: 'fixed',
    right: 60,
    zIndex: 6
  }
}));

function moveToTalk() {
  window.open('https://www.google.com', '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
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
