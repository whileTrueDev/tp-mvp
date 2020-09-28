import React from 'react';
// @material-ui core components
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
// @material-ui icons
import Cached from '@material-ui/icons/Cached';
// styles
import useNavbarStyles from './Navbar.style';
// context
import SubscribeContext from '../../../../utils/contexts/SubscribeContext';

const StyledMenu = withStyles((theme) => ({
  paper: {
    border: `1px solid ${theme.palette.divider}`,
  },
}))((props: MenuProps) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'center',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'center',
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    '&:focus': {
      backgroundColor: theme.palette.primary.main,
      '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

export interface SubscribeUserInfo {
  userId: string;
  targetUserId: string;
  startAt: string;
  endAt: string;
}

interface NavbarUserListProps{
  navUserInfoList: SubscribeUserInfo[];
}

export default function NavbarUserList(): JSX.Element {
  const classes = useNavbarStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const subscribe = React.useContext(SubscribeContext);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const subscribeUserListItem = (): JSX.Element[] | JSX.Element => {
    // 구독한 유저가 1명이라도 존재 할 경우 (자기 자신 포함)
    if (subscribe.validSubscribeUserList.length > 0) {
      return subscribe.validSubscribeUserList.map((user) => (
        <StyledMenuItem
          key={user.targetUserId}
          onClick={() => { subscribe.handleCurrTargetUser(user); handleClose(); }}
        >
          <Cached fontSize="small" style={{ marginRight: 16 }} />
          <ListItemText primary={user.targetUserId} />
        </StyledMenuItem>
      ));
    }
    // 구독한 유저가 존재 하지 않을 경우
    return (
      <StyledMenuItem>
        <ListItemText primary="구독한 유저가 없습니다." />
      </StyledMenuItem>
    );
  };

  return (
    <div>
      <Button onClick={handleClick} className={classes.useNameButton}>
        <Typography variant="h4" className={classes.title}>
          {subscribe.currUser.targetUserId}
        </Typography>
        <Typography variant="h4">
          님
        </Typography>
      </Button>
      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {subscribeUserListItem()}

      </StyledMenu>
    </div>
  );
}
