import React from 'react';
import {
  Paper, Typography, Divider, Avatar,
  List, ListItem, Popover, PopoverProps
} from '@material-ui/core';
import {
  AccountBox, ExitToApp,
  Brightness7 as LightThemeIcon,
  Brightness4 as DarkThemeIcon,
} from '@material-ui/icons';
import THEME_TYPE from '../interfaces/ThemeType';

export interface UserMenuPopperProps extends Omit<PopoverProps, 'children'> {
  themeType: THEME_TYPE;
  anchorEl: HTMLElement | null;
  handleThemeChange: () => void;
}
export default function UserMenuPopper(props: UserMenuPopperProps): JSX.Element {
  const {
    open, anchorEl, onClose, themeType, handleThemeChange, ...prop
  } = props;

  return (
    <Popover
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
      <Paper elevation={2} style={{ width: 330, display: 'block' }}>
        <div style={{ display: 'flex', padding: 16 }}>
          <Avatar />
          <div style={{
            width: '100%',
            display: 'block',
            marginLeft: 16,
            marginRight: 16,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
          >
            <Typography variant="h6">강화수</Typography>
            <Typography variant="body2" component="span">iamsupermazinga@gmail.comiamsupermazinga@gmail.com</Typography>
          </div>
        </div>
        <Divider />
        <List>
          <div style={{
            padding: `${8}px ${0}px`,
            width: '100%',
            display: 'flex',
            alignItems: 'flex-start',
            flexDirection: 'column'
          }}
          >
            <ListItem button style={{ height: 40, paddingLeft: 16, paddingRight: 32 }}>
              <AccountBox color="action" />
              <Typography style={{ marginLeft: 16 }} variant="body1">내 정보</Typography>
            </ListItem>
            <ListItem
              button
              style={{ height: 40, paddingLeft: 16, paddingRight: 32 }}
              onClick={handleThemeChange}
            >
              {themeType === 'light' ? (
                <>
                  <LightThemeIcon color="action" />
                  <Typography style={{ marginLeft: 16 }} variant="body1">어두운 테마로 변경</Typography>
                </>
              ) : (
                <>
                  <DarkThemeIcon color="action" />
                  <Typography style={{ marginLeft: 16 }} variant="body1">밝은 테마로 변경</Typography>
                </>
              )}
            </ListItem>
            <ListItem button style={{ height: 40, paddingLeft: 16, paddingRight: 32 }}>
              <ExitToApp color="action" />
              <Typography style={{ marginLeft: 16 }} variant="body1">로그아웃</Typography>
            </ListItem>
          </div>
        </List>
      </Paper>
    </Popover>
  );
}
