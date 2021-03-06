import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  Paper, Typography, Divider, Avatar,
  List, ListItem, Popover, PopoverProps,
} from '@material-ui/core';
import {
  AccountBox, ExitToApp,
  Brightness7 as LightThemeIcon,
  Brightness4 as DarkThemeIcon,
} from '@material-ui/icons';
import { useHistory } from 'react-router-dom';
import useAuthContext from '../../../utils/hooks/useAuthContext';
import { TruepointTheme } from '../../../interfaces/TruepointTheme';

const useStyles = makeStyles((theme) => ({
  container: { width: 330, display: 'block' },
  description: { display: 'flex', padding: theme.spacing(2) },
  descriptionDetail: {
    width: '100%',
    display: 'block',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  menulist: {
    padding: `${theme.spacing(1)}px ${0}px`,
    width: '100%',
    display: 'flex',
    alignItems: 'flex-start',
    flexDirection: 'column',
  },
  menulistItem: {
    height: 40, paddingLeft: theme.spacing(2), paddingRight: theme.spacing(4),
  },
  menuText: { marginLeft: theme.spacing(2) },
}));

export interface UserMenuPopperProps extends Omit<PopoverProps, 'children'> {
  anchorEl: HTMLElement | null;
  avatarSrc?: string
  nickName?: string;
  email?: string;
}
export default function UserMenuPopper(props: UserMenuPopperProps): JSX.Element {
  const classes = useStyles();
  const theme = useTheme<TruepointTheme>();
  const history = useHistory();
  const {
    open, anchorEl, onClose, avatarSrc,
    email,
    ...prop
  } = props;

  const authContext = useAuthContext();

  return (
    <Popover
      disableScrollLock
      open={open}
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
      {...prop}
    >
      <Paper elevation={2} className={classes.container}>
        <div className={classes.description}>
          <Avatar src={avatarSrc} />
          <div className={classes.descriptionDetail}>
            <Typography variant="h6">
              {`${authContext.user.nickName}`}
            </Typography>
            <Typography variant="body2" component="span">{email}</Typography>
          </div>
        </div>
        <Divider />
        <List>
          <div className={classes.menulist}>
            <ListItem
              button
              className={classes.menulistItem}
              onClick={() => {
                history.push('/mypage');
              }}
            >
              <AccountBox color="action" />
              <Typography className={classes.menuText} variant="body1">내 정보 관리</Typography>
            </ListItem>
            <ListItem
              button
              className={classes.menulistItem}
              onClick={theme.handleThemeChange}
            >
              {theme.palette.type === 'light' ? (
                <>
                  <LightThemeIcon color="action" />
                  <Typography className={classes.menuText} variant="body1">어두운 테마로 변경</Typography>
                </>
              ) : (
                <>
                  <DarkThemeIcon color="action" />
                  <Typography className={classes.menuText} variant="body1">밝은 테마로 변경</Typography>
                </>
              )}
            </ListItem>
            <ListItem
              button
              className={classes.menulistItem}
              onClick={() => {
                authContext.handleLogout();
              }}
            >
              <ExitToApp color="action" />
              <Typography className={classes.menuText} variant="body1">로그아웃</Typography>
            </ListItem>
          </div>
        </List>
      </Paper>
    </Popover>
  );
}
