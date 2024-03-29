import React, { useEffect } from 'react';
import {
  Avatar, CircularProgress, Paper, Typography,
} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
// 클로즈베타 - 구독관련 기능 X 주석처리
// import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import useAxios from 'axios-hooks';
import useDialog from '../../../utils/hooks/useDialog';
import MainDialog from './MainDialog';
import useAuthContext from '../../../utils/hooks/useAuthContext';
import usePublicMainUser from '../../../store/usePublicMainUser';

export const useStyles = makeStyles((theme) => ({
  container: {
    padding: theme.spacing(2), display: 'flex', alignItems: 'center', position: 'relative',
  },
  loading: {
    display: 'flex', justifyContent: 'center', alignItems: 'center',
  },
  avatar: { width: theme.spacing(14), height: theme.spacing(14), margin: theme.spacing(4) },
  platformLogo: { width: 30, height: 30, marginRight: theme.spacing(1) },
  flexBox: { display: 'flex', alignItems: 'center' },
  userTier: { marginLeft: theme.spacing(2) },
  secondSection: { marginTop: theme.spacing(1) },
  bold: { fontWeight: 'bold' },
}));

export default function UserProfile(): JSX.Element {
  const classes = useStyles();
  const auth = useAuthContext();
  const { user } = usePublicMainUser((state) => state);
  const [profileRequestObject, refetch] = useAxios<User>({
    url: 'users', method: 'GET', params: { userId: user.userId || auth.user.userId },
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
      && (
      <>
        <Avatar className={classes.avatar} src={profileRequestObject.data.profileImage || ''} />

        <div>
          {/* 연동된 플랫폼 목록 */}
          <div className={classes.flexBox}>
            <img
              className={classes.platformLogo}
              src="/images/logo/afreecaLogo.png"
              alt=""
              draggable={false}
              style={{ filter: profileRequestObject.data.afreeca?.afreecaId ? 'none' : 'grayscale(100%)' }}
            />
            <img
              className={classes.platformLogo}
              src="/images/logo/twitchLogo.png"
              alt=""
              draggable={false}
              style={{ filter: profileRequestObject.data.twitch?.twitchId ? 'none' : 'grayscale(100%)' }}
            />
            <img
              className={classes.platformLogo}
              src="/images/logo/youtubeLogo.png"
              alt=""
              draggable={false}
              style={{ filter: profileRequestObject.data.youtube?.youtubeId ? 'none' : 'grayscale(100%)' }}
            />
          </div>
          {/* 이름 */}
          <div className={classes.flexBox}>
            <Typography variant="h4" className={classes.bold}>
              {`${profileRequestObject.data.nickName || profileRequestObject.data.userId}`}
              <Typography className={classes.bold} component="span" variant="h6">&nbsp;님</Typography>
            </Typography>
          </div>

          <div>
            {/* 이메일 */}
            {profileRequestObject.data.mail && (
              <Typography>{profileRequestObject.data.mail}</Typography>
            )}

            {/* 요금제 */}
            {/* <div className={classnames(classes.flexBox, classes.secondSection)}>
              <Typography className={classes.bold} variant="body1">요금제</Typography>
              <Chip label="클로즈베타 테스터" size="small" color="primary" className={classes.userTier} />
            </div> */}

            {/* 클로즈베타 처리 - 잠시 제거 */}
            {/* <Typography className={classes.text} variant="body1" color="primary" paragraph>
                  업그레이드
                  <ArrowForwardIosIcon fontSize="inherit" />
                </Typography> */}
          </div>
        </div>
      </>
      )}
      {/* 아프리카 / 트위치 / 유튜브 중 아이디가 한개도 없는 경우 */}
      {!profileRequestObject.loading && profileRequestObject.data
      && !(profileRequestObject.data.afreeca?.afreecaId
          || profileRequestObject.data.youtube?.youtubeId
          || profileRequestObject.data.twitch?.twitchId
      ) && (
      <MainDialog
        open={open}
        handleOpen={handleOpen}
        handleClose={handleClose}
      />
      )}
    </Paper>
  );
}
