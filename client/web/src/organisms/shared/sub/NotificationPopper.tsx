import React from 'react';
// @material-ui core components
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Typography, Divider, Badge, List, ListSubheader, Popover,
} from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
// axios hooks
import useAxios from 'axios-hooks';
// snackbar
import { useSnackbar } from 'notistack';
// shared dtos and interfaces
import { ChangeReadState } from '@truepoint/shared/dist/dto/notification/changeReadState.dto';
// context
import useAuthContext from '../../../utils/hooks/useAuthContext';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';

export interface Notification {
  index: number;
  title: string;
  content: string;
  dateform: string;
  readState: boolean;
}

export interface FatalError {
  helperText: string;
  isError: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  contents: {
    color: theme.palette.text.primary,
    width: 420,
    maxHeight: 540,
    zIndex: 10,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    overflowX: 'hidden',
    overflowY: 'auto',
  },
  title: {
    padding: '8px 0px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  message: {
    marginTop: 4, marginBottom: 4,
  },
}));

const UNREAD_STATE = false; // 읽지않음 상태값

function NotificationPopper({
  anchorEl,
  notificationData,
  setChangeReadState,
  onClose,
}: {
  anchorEl: HTMLElement;
  notificationData: Notification[];
  setChangeReadState: React.Dispatch<React.SetStateAction<boolean>>;
  onClose: () => void;
}): JSX.Element {
  const classes = useStyles();
  const auth = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();
  // 알림 목록 불러오기
  const [{ loading: patchLoading, error: patchError }, excutePatch] = useAxios({
    url: '/notification',
    method: 'patch',
  }, { manual: true });

  // 알림 클릭 핸들러
  const handleNotificationListItemClick = (notification: Notification) => {
    if (notification.readState === UNREAD_STATE) {
      const changeReqParam: ChangeReadState = {
        userId: auth.user.userId, // userId (client login user)
        index: notification.index,
      };
      excutePatch({
        data: changeReqParam,
      }).then(() => {
        setChangeReadState(true);
      }).catch((err) => {
        if (err.response) {
          ShowSnack('알림을 읽음 표시하는 동안 문제가 발생했습니다. 다시 시도해주세요', 'error', enqueueSnackbar);
        }
      });

      if (!patchError && !patchLoading) setChangeReadState(true);
    }
  };

  return (
    <Popover
      disableScrollLock
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      style={{ zIndex: 9999 }}
    >
      {/* 공지 메뉴 컴포넌트 */}
      <List
        className={classes.contents}
        subheader={(
          <ListSubheader>
            <div className={classes.title}>
              <Typography variant="h5">알림</Typography>
              <Typography align="right" gutterBottom variant="caption">
                클릭시 읽음처리됩니다.
              </Typography>
            </div>
          </ListSubheader>
        )}
      >
        <div>
          {notificationData.length < 1 && (
            <div style={{
              height: 150, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 16,
            }}
            >
              <Typography gutterBottom variant="caption">
                비었어요..
              </Typography>
            </div>
          )}
          {notificationData.map((noti) => (
            <div key={noti.index}>
              <MenuItem onClick={() => handleNotificationListItemClick(noti)}>
                <div className={classes.message}>
                  <Typography>
                    {noti.readState
                      ? (<Badge variant="dot" color="default"><span /></Badge>)
                      : (<Badge variant="dot" color="secondary"><span /></Badge>)}
                  </Typography>
                  <Typography variant="body1" gutterBottom noWrap>
                    {noti.title}
                  </Typography>
                  <Typography variant="body2" gutterBottom noWrap>
                    <span style={{ whiteSpace: 'pre-line' }}>
                      {noti.content}
                    </span>
                  </Typography>
                  <Typography variant="caption" gutterBottom noWrap>
                    <span>{`${noti.dateform} / TruePoint`}</span>
                  </Typography>
                </div>
              </MenuItem>
              <Divider />
            </div>
          ))}
        </div>

      </List>
    </Popover>
  );
}

export default NotificationPopper;
