import {
  Paper, CircularProgress, Avatar, Typography,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import useAxios from 'axios-hooks';
import React, { useEffect } from 'react';
import useAuthContext from '../../../utils/hooks/useAuthContext';
import { useStyles } from '../dashboard/UserProfile';
import useMediaSize from '../../../utils/hooks/useMediaSize';

const useUserSettingStyle = makeStyles((theme: Theme) => createStyles({
  avatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    marginRight: theme.spacing(3),
  },
}));

export default function UserSetting(): JSX.Element {
  const classes = useStyles();
  const { avatar } = useUserSettingStyle();
  const auth = useAuthContext();
  const [profileRequestObject, getProfile] = useAxios<User>({
    url: 'users', method: 'GET', params: { userId: auth.user.userId },
  }, { manual: true });
  const { isMobile } = useMediaSize();

  useEffect(() => {
    if (auth.user.userId) {
      getProfile();
    }
  }, [auth.user.userId, getProfile]);

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
        <Avatar className={isMobile ? avatar : classes.avatar} src={profileRequestObject.data.profileImage || ''} />

        <div>
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
          </div>
        </div>
      </>
      )}
    </Paper>
  );
}
