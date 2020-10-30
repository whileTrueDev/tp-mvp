import React from 'react';
import { Avatar, Paper, Typography } from '@material-ui/core';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import makeStyles from '@material-ui/core/styles/makeStyles';
import useAuthContext from '../../../utils/hooks/useAuthContext';

const useStyles = makeStyles((theme) => ({
  container: { padding: theme.spacing(4), display: 'flex', alignItems: 'center' },
  avatar: { width: 150, height: 150, margin: theme.spacing(4) },
}));

export default function UserProfile(): JSX.Element {
  const classes = useStyles();
  const authValue = useAuthContext();

  return (
    <Paper className={classes.container}>
      <Avatar className={classes.avatar} />

      <div>
        {/* 이름 */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Typography style={{ fontWeight: 'bold' }} variant="h4">
            {`${authValue.user.userId} 님`}
            {/* "님" 볼드처리 제거의 경우 */}
            {/* <Typography component="span">님</Typography> */}
          </Typography>

          <img style={{ margin: '0px 4px' }} width={30} height={30} src="/images/logo/twitchLogo.png" alt="" />
          <img style={{ margin: '0px 4px' }} width={30} height={30} src="/images/logo/youtubeLogo.png" alt="" />
          <img style={{ margin: '0px 4px' }} width={30} height={30} src="/images/logo/afreecatvLogo.png" alt="" />
        </div>

        {/* 요금제 */}
        <div style={{ verticalAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Typography style={{ paddingTop: 8 }} variant="body1">요금제</Typography>
            <Typography variant="body1" style={{ marginLeft: 16, paddingTop: 8, color: 'grey' }}>클로즈베타 테스터</Typography>
          </div>

          <Typography style={{ paddingTop: 8 }} variant="body1" color="primary" paragraph>
            업그레이드
            <ArrowForwardIosIcon fontSize="inherit" />
          </Typography>

        </div>
      </div>
    </Paper>
  );
}
