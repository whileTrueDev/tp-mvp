import React, { useEffect } from 'react';
import classnames from 'classnames';
import {
  Avatar, Chip, CircularProgress, Paper, Typography,
} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
// 클로즈베타 - 구독관련 기능 X 주석처리
// import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import useAxios from 'axios-hooks';
import useDialog from '../../../utils/hooks/useDialog';
import MainDialog from './MainDialog';

const useStyles = makeStyles((theme) => ({
  container: {
    height: '100%', padding: theme.spacing(4), display: 'flex', alignItems: 'center',
  },
  loading: {
    height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center',
  },
  avatar: { width: 150, height: 150, margin: theme.spacing(4) },
  platformLogo: { width: 30, height: 30, margin: '0px 4px' },
  flexBox: { display: 'flex', alignItems: 'center' },
  userTier: { marginLeft: theme.spacing(2), marginTop: theme.spacing(1) },
  text: { paddingTop: theme.spacing(1) },
  bold: { fontWeight: 'bold' },
}));

export default function UserProfile(): JSX.Element {
  const classes = useStyles();
  const [profileRequestObject, refetch] = useAxios<User>({
    url: 'users', method: 'GET',
  });

  const { open, handleOpen, handleClose } = useDialog();

  useEffect(() => {
    refetch();
  }, [refetch]);

  return (
    <Paper className={classes.container}>
      {/* 로딩중 */}
      {profileRequestObject.loading && (
      <div className={classes.loading}><CircularProgress /></div>
      )}

      {!profileRequestObject.loading
      && profileRequestObject.data
       && (profileRequestObject.data.afreecaId
        || profileRequestObject.data.youtubeId
        || profileRequestObject.data.twitchId)
        ? (
          <>
            <Avatar className={classes.avatar} src={profileRequestObject.data.profileImage || ''} />

            <div>
              {/* 이름 */}
              <div className={classes.flexBox}>
                <Typography variant="h4" style={{ fontWeight: 'bold' }}>
                  {`${profileRequestObject.data.nickName || profileRequestObject.data.userId} 님`}
                </Typography>

                {/* 연동된 플랫폼 목록 */}
                <img
                  className={classes.platformLogo}
                  src="/images/logo/afreecaLogo.png"
                  alt=""
                  draggable={false}
                  style={{ filter: profileRequestObject.data.afreecaId ? 'none' : 'grayscale(100%)' }}
                />
                <img
                  className={classes.platformLogo}
                  src="/images/logo/twitchLogo.png"
                  alt=""
                  draggable={false}
                  style={{ filter: profileRequestObject.data.twitchId ? 'none' : 'grayscale(100%)' }}
                />
                <img
                  className={classes.platformLogo}
                  src="/images/logo/youtubeLogo.png"
                  alt=""
                  draggable={false}
                  style={{ filter: profileRequestObject.data.youtubeId ? 'none' : 'grayscale(100%)' }}
                />

              </div>

              <div>
                {/* 이메일 */}
                <Typography className={classes.text}>{profileRequestObject.data.mail}</Typography>

                {/* 요금제 */}
                <div className={classes.flexBox}>
                  <Typography className={classnames(classes.text, classes.bold)} variant="body1">요금제</Typography>
                  <Chip label="클로즈베타 테스터" size="small" color="primary" className={classnames(classes.userTier)} />
                </div>

                {/* 클로즈베타 처리 - 잠시 제거 */}
                {/* <Typography className={classes.text} variant="body1" color="primary" paragraph>
                  업그레이드
                  <ArrowForwardIosIcon fontSize="inherit" />
                </Typography> */}
              </div>
            </div>
          </>
        ) : (
          <MainDialog
            open={open}
            handleOpen={handleOpen}
            handleClose={handleClose}
          />
        )}
    </Paper>
  );
}
