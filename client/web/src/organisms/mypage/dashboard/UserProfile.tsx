import React from 'react';
import classnames from 'classnames';
import { Avatar, Paper, Typography } from '@material-ui/core';
// 클로즈베타 - 구독관련 기능 X 주석처리
// import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useAuthContext from '../../../utils/hooks/useAuthContext';

const useStyles = makeStyles((theme) => ({
  container: { padding: theme.spacing(4), display: 'flex', alignItems: 'center' },
  avatar: { width: 150, height: 150, margin: theme.spacing(4) },
  platformLogo: { width: 30, height: 30, margin: '0px 4px' },
  flexBox: { display: 'flex', alignItems: 'center' },
  userTier: { marginLeft: 16, color: theme.palette.text.secondary },
  text: { paddingTop: theme.spacing(1) },
}));

export default function UserProfile(): JSX.Element {
  const classes = useStyles();
  const authValue = useAuthContext();

  return (
    <Paper className={classes.container}>
      <Avatar className={classes.avatar} />

      <div>
        {/* 이름 */}
        <div className={classes.flexBox}>
          <Typography variant="h4" style={{ fontWeight: 'bold' }}>
            {`${authValue.user.userId} 님`}
            {/* "님" 볼드처리 제거의 경우 */}
            {/* <Typography component="span">님</Typography> */}
          </Typography>

          <img className={classes.platformLogo} src="/images/logo/twitchLogo.png" alt="" />
          <img className={classes.platformLogo} src="/images/logo/youtubeLogo.png" alt="" />
          <img className={classes.platformLogo} src="/images/logo/afreecatvLogo.png" alt="" />
        </div>

        {/* 요금제 */}
        <div>
          <div className={classes.flexBox}>
            <Typography className={classes.text} variant="body1">요금제</Typography>
            <Typography className={classnames(classes.text, classes.userTier)} variant="body1">클로즈베타 테스터</Typography>
          </div>

          {/* 클로즈베타 처리 - 잠시 제거 */}
          {/* <Typography className={classes.text} variant="body1" color="primary" paragraph>
            업그레이드
            <ArrowForwardIosIcon fontSize="inherit" />
          </Typography> */}

        </div>
      </div>
    </Paper>
  );
}
