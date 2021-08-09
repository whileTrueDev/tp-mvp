import React, { useRef } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
// @material-ui/core components
import Tooltip from '@material-ui/core/Tooltip';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
// @material-ui/icons
import Notifications from '@material-ui/icons/Notifications';
// axios-hooks
import { useSnackbar } from 'notistack';
// shared dtos and interfaces
import { NotificationGetRequest } from '@truepoint/shared/dist/dto/notification/notificationGet.dto';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import { useQuery } from 'react-query';
import { AxiosError } from 'axios';
import useAnchorEl from '../../../utils/hooks/useAnchorEl';
// notificaiton list component
import NotificationPopper, { Notification } from './NotificationPopper';
// context
import useAuthContext from '../../../utils/hooks/useAuthContext';
import UserMenuPopover from './UserMenuPopover';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import axios from '../../../utils/axios';

const useStyles = makeStyles((theme: Theme) => ({
  icon: {
    width: 32,
    height: 32,
    color: theme.palette.text.primary,
  },
}));

export interface FatalError {
  helperText: string;
  isError: boolean;
}

function HeaderLinks(): JSX.Element {
  const notificationRef = useRef<HTMLButtonElement | null>(null);
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const auth = useAuthContext();
  const {
    anchorEl, handleAnchorOpen, handleAnchorClose,
  } = useAnchorEl();

  const {
    data: getData, isFetching: getLoading, error: getError, refetch: executeGet,
  } = useQuery(
    ['notifications', auth.user.userId],
    async () => {
      const params: NotificationGetRequest = { userId: auth.user.userId };
      const { data: notiData } = await axios.get('/notification', {
        params,
      });
      return notiData;
    },
    {
      enabled: !!auth.user.userId,
      onError: (err: AxiosError) => {
        if (err.response) {
          ShowSnack('새로운 알림을 가져오는 동안 문제가 발생했습니다. 다시 시도해주세요', 'error', enqueueSnackbar);
        }
      },
    },
  );

  // 자식 컴포넌트에서 안읽은 알림을 클릭했는지를 검사하기 위한 state
  const [changeReadState, setChangeReadState] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (changeReadState) {
      executeGet();
      setChangeReadState(false);
    }
  }, [changeReadState, executeGet, enqueueSnackbar]);

  // ******************************************************************
  // 유저 로고 버튼 및 메뉴
  const [UserMenuAnchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(UserMenuAnchorEl ? null : event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const UserMenuOpen = Boolean(UserMenuAnchorEl);
  // ******************************************************************
  // 유저 프로필 사진 이미지 조회
  const { data: profileData, isFetching: loading } = useQuery(
    ['user', auth.user.userId],
    async () => {
      const { data: userData } = await axios.get<User>('/users');
      return userData;
    },
    { enabled: !!auth.user.userId },
  );
  return (
    <Grid container alignItems="flex-end" justify="flex-end">

      <Tooltip title="알림">
        <IconButton
          aria-label="notifications"
          ref={notificationRef}
          onClick={(e): void => {
            handleAnchorOpen(e);
          }}
        >
          <Badge
            badgeContent={!getLoading && getData && !getError
              ? (getData.filter((noti: Notification) => noti.readState === false).length)
              : (null)}
            color="secondary"
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <Notifications className={classes.icon} />
          </Badge>
        </IconButton>
      </Tooltip>

      <IconButton onClick={handleClick}>
        <Avatar
          className={classes.icon}
          src={(!loading && profileData && profileData.profileImage)
            ? profileData.profileImage : ''}
        />
      </IconButton>

      {anchorEl && !getLoading && getData && !getError && (
      <NotificationPopper
        anchorEl={anchorEl}
        notificationData={getData}
        setChangeReadState={setChangeReadState}
        onClose={handleAnchorClose}
      />
      )}
      {UserMenuAnchorEl && !loading && profileData && (
      <UserMenuPopover
        avatarSrc={(!loading && profileData && profileData.profileImage)
          ? profileData.profileImage : ''}
        nickName={!loading && profileData && profileData.nickName}
        email={!loading && profileData && profileData.mail}
        open={UserMenuOpen}
        anchorEl={UserMenuAnchorEl}
        onClose={handleClose}
      />
      )}
    </Grid>
  );
}

export default HeaderLinks;
