import {
  Paper, CircularProgress, Avatar, Typography, Button,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import useAxios from 'axios-hooks';
import React, { useEffect, useMemo } from 'react';
import useAuthContext from '../../../utils/hooks/useAuthContext';
import { useStyles } from '../dashboard/UserProfile';
import useMediaSize from '../../../utils/hooks/useMediaSize';

const useUserSettingStyle = makeStyles((theme: Theme) => createStyles({
  smallAvatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
  },
  avatarContainer: {
    marginRight: theme.spacing(1),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    position: 'absolute',
    right: theme.spacing(2),
    top: theme.spacing(2),
  },
}));

export default function UserSetting(): JSX.Element {
  const classes = useStyles();
  const { smallAvatar, avatarContainer, editButton } = useUserSettingStyle();
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

  const InformationDisplay = useMemo(() => profileRequestObject.data && (
    <div>
      {/* 이름 */}
      <div className={classes.flexBox}>
        <Typography component="span">닉네임 :&nbsp;</Typography>
        <Typography variant="h6" component="span" className={classes.bold}>
          {`${profileRequestObject.data.nickName}`}
        </Typography>
        <Typography component="span">&nbsp;님</Typography>
      </div>

      <div>
        {/* 이메일 */}
        {profileRequestObject.data.mail && (
        <Typography>{`이메일 : ${profileRequestObject.data.mail}`}</Typography>
        )}
      </div>
    </div>
  ), [classes.bold, classes.flexBox, profileRequestObject.data]);

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
        <div className={avatarContainer}>
          <Avatar className={isMobile ? smallAvatar : classes.avatar} src={profileRequestObject.data.profileImage || ''} />
          {/* 이름 */}
          {profileRequestObject.data.name && (
          <Typography variant={isMobile ? 'h6' : 'h4'} className={classes.bold}>
            {`${profileRequestObject.data.name}`}
          </Typography>
          )}
        </div>

        {InformationDisplay}

        <Button
          variant="contained"
          color="primary"
          size={isMobile ? 'small' : 'medium'}
          className={editButton}
        >
          정보 수정
        </Button>
      </>
      )}
    </Paper>
  );
}
