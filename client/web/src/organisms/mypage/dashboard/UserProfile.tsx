import React from 'react';
import {
  Avatar, CircularProgress, Paper, Typography,
} from '@material-ui/core';
import makeStyles from '@material-ui/core/styles/makeStyles';
// 클로즈베타 - 구독관련 기능 X 주석처리
// import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import useDialog from '../../../utils/hooks/useDialog';
import MainDialog from './MainDialog';
import useAuthContext from '../../../utils/hooks/useAuthContext';
import usePublicMainUser from '../../../store/usePublicMainUser';
import { useUserProfileQuery } from '../../../utils/hooks/query/useUserProfileQuery';

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
  const { data, isFetching: loading } = useUserProfileQuery(user.userId || auth.user.userId, {
    enabled: !!(user.userId || auth.user.userId),
  });

  const { open, handleOpen, handleClose } = useDialog();

  return (
    <Paper className={classes.container}>
      {/* 로딩중 */}
      {loading && (
      <div className={classes.loading}><CircularProgress /></div>
      )}

      {!loading
      && data
      && (
      <>
        <Avatar className={classes.avatar} src={data.profileImage || ''} />

        <div>
          {/* 연동된 플랫폼 목록 */}
          <div className={classes.flexBox}>
            <img
              className={classes.platformLogo}
              src="/images/logo/afreecaLogo.png"
              alt=""
              draggable={false}
              style={{ filter: data.afreeca?.afreecaId ? 'none' : 'grayscale(100%)' }}
            />
            <img
              className={classes.platformLogo}
              src="/images/logo/twitchLogo.png"
              alt=""
              draggable={false}
              style={{ filter: data.twitch?.twitchId ? 'none' : 'grayscale(100%)' }}
            />
            <img
              className={classes.platformLogo}
              src="/images/logo/youtubeLogo.png"
              alt=""
              draggable={false}
              style={{ filter: data.youtube?.youtubeId ? 'none' : 'grayscale(100%)' }}
            />
          </div>
          {/* 이름 */}
          <div className={classes.flexBox}>
            <Typography variant="h4" className={classes.bold}>
              {`${data.nickName || data.userId}`}
              <Typography className={classes.bold} component="span" variant="h6">&nbsp;님</Typography>
            </Typography>
          </div>

          <div>
            {/* 이메일 */}
            {data.mail && (
              <Typography>{data.mail}</Typography>
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
      {!loading && data
      && !(data.afreeca?.afreecaId
          || data.youtube?.youtubeId
          || data.twitch?.twitchId
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
