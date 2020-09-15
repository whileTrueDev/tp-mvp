import React from 'react';
// @material-ui core components
import { makeStyles, Theme } from '@material-ui/core/styles';
import {
  Typography, Divider, Badge, Popper, List, ListSubheader
} from '@material-ui/core';
import MenuItem from '@material-ui/core/MenuItem';
// types
import useAxios from 'axios-hooks';

export interface Notification {
  index: number;
  title: string;
  content: string;
  dateform: string;
  readState: number;
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
    overflowY: 'auto'
  },
  title: {
    padding: '8px 0px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `1px solid ${theme.palette.divider}`
  },
  message: {
    marginTop: 4, marginBottom: 4
  },
}));

const UNREAD_STATE = 0; // 읽지않음 상태값

function NotificationPopper({
  anchorEl,
  notificationData,
  setChangeReadState,
}: {
  anchorEl: HTMLElement;
  notificationData: Notification[];
  setChangeReadState: React.Dispatch<React.SetStateAction<boolean>>
}): JSX.Element {
  const classes = useStyles();
  const [{ loading: patchLoading, error: patchError }, excutePatch] = useAxios({
    url: 'http://localhost:3000/notification',
    method: 'patch',
  }, {
    manual: true
  });

  const handleNotificationListItemClick = (notification: Notification) => {
    if (notification.readState === UNREAD_STATE) {
      excutePatch({
        data: {
          userId: 'test2', // userId (client login user)
          index: notification.index,
        }
      });

      if (!patchError && !patchLoading) setChangeReadState(true);
    }
  };

  return (
    <Popper
      placement="top-end"
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      disablePortal
      modifiers={{
        flip: { enabled: true, },
        preventOverflow: { enabled: false, boundariesElement: 'scrollParent', },
        hide: { enabled: false }
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
                    <span>{`${noti.dateform} / ONAD`}</span>
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
