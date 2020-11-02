import React from 'react';
// @material-ui core components
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Typography, Divider, Badge, Popper, List, ListSubheader,
} from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
// types
import useAxios from 'axios-hooks';
// context
import useAuthContext from '../../../utils/hooks/useAuthContext';

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
  handleError,
}: {
  anchorEl: HTMLElement;
  notificationData: Notification[];
  setChangeReadState: React.Dispatch<React.SetStateAction<boolean>>;
  handleError: (newError: FatalError) => void;
}): JSX.Element {
  const classes = useStyles();
  const auth = useAuthContext();
  const [{ loading: patchLoading, error: patchError }, excutePatch] = useAxios({
    url: '/notification',
    method: 'patch',
  }, { manual: true });

  const handleNotificationListItemClick = (notification: Notification) => {
    if (notification.readState === UNREAD_STATE) {
      excutePatch({
        data: {
          userId: auth.user.userId, // userId (client login user)
          index: notification.index,
        },
      }).then(() => {
        setChangeReadState(true);
      }).catch((err) => {
        if (err.response) {
          handleError({
            isError: true,
            helperText: '알림을 수정하는 동안 문제가 발생했습니다.',
          });
        }
      });
      // snack bar 일감 이후 snack bar 삽입

      if (!patchError && !patchLoading) setChangeReadState(true);
    }
  };

  return (
    <Popper
      placement="bottom-end"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      disablePortal
      modifiers={{
        flip: { enabled: true },
        preventOverflow: { enabled: false, boundariesElement: 'scrollParent' },
        hide: { enabled: false },
      }}
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
    </Popper>
  );
}

export default NotificationPopper;
