import React from 'react';
import Button from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    right: 50,
    position: 'fixed',
    bottom: 50,
    zIndex: 200,
    [theme.breakpoints.down('sm')]: {
      right: 0,
      bottom: 0,
    },
  },
  kakaoImg: {
    width: 50,
    height: 50,
    [theme.breakpoints.down('sm')]: {
      width: 40,
      height: 40,
    },
  },
}));

function moveToTalk() {
  window.open('https://www.google.com', '_blank', 'location=yes,height=570,width=520,scrollbars=yes,status=yes');
}

function KakaoTalk(): JSX.Element {
  const classes = useStyles();
  return (
    <Button className={classes.root} onClick={moveToTalk}>
      <img src="/images/favicon/kakaoIcon.png" alt="kakao" className={classes.kakaoImg} />
    </Button>
  );
}
export default KakaoTalk;
