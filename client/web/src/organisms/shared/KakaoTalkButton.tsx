import React from 'react';
import Button from '@material-ui/core/IconButton';
import { makeStyles, Tooltip } from '@material-ui/core';
import kakaoChattingURL from '../../constants/kakao';

const useStyles = makeStyles((theme) => ({
  root: {
    right: 50,
    bottom: 50,
    [theme.breakpoints.down('sm')]: {
      right: 10, bottom: 10,
    },
    position: 'fixed',
    zIndex: 200,
  },
  kakaoImg: {
    width: 50,
    height: 50,
    [theme.breakpoints.down('sm')]: {
      width: 40, height: 40,
    },
  },
}));

function moveToTalk() {
  window.open(kakaoChattingURL, '_blank');
}

function KakaoTalk(): JSX.Element {
  const classes = useStyles();
  return (
    <Button className={classes.root} onClick={moveToTalk}>
      <Tooltip title="카카오톡 채팅 문의하기" placement="top">
        <img src="/images/favicon/kakaoIcon.png" alt="" className={classes.kakaoImg} />
      </Tooltip>
    </Button>
  );
}
export default KakaoTalk;
