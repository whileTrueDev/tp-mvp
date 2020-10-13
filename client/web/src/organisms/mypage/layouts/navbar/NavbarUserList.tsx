import React from 'react';
// @material-ui core components
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
// @material-ui icons
import EmojiObjectsOutlinedIcon from '@material-ui/icons/EmojiObjectsOutlined';
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
    '&.Mui-selected': {
      backgroundColor: theme.palette.primary.dark,
      color: '#FFFF',
      '&:hover': {
        backgroundColor: theme.palette.primary.dark,
        color: '#FFFF',
      },
    },
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
      color: '#FFFF',
    },
  },

}))(MenuItem);

const StyledToolTip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.primary.light,
    color: 'black',
    maxWidth: '425px',
  },
  arrow: {
    color: theme.palette.primary.light,
    fontSize: '30px',
  },
}))(Tooltip);

export interface SubscribeUserInfo {
  userId: string;
  targetUserId: string;
  startAt: string;
  endAt: string;
}

export default function NavbarUserList(): JSX.Element {
  const classes = useNavbarStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const subscribe = React.useContext(SubscribeContext);
  const [tooltipOpen, setTooltipOpen] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (subscribe.validSubscribeUserList.length > 1) {
      setTooltipOpen(true);
      setTimeout(() => {
        setTooltipOpen(false);
      }, 5000);
    }
  }, [subscribe.validSubscribeUserList]);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    if (subscribe.validSubscribeUserList.length > 1) {
      setAnchorEl(event.currentTarget);
      setTooltipOpen(false);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const subscribeUserListItem = (): JSX.Element[] | JSX.Element => {
    // 구독한 유저가 1명이라도 존재 할 경우 (자기 자신 포함)
    if (subscribe.validSubscribeUserList.length > 0) {
      return (
        <List style={{ padding: '0px' }}>
          {subscribe.validSubscribeUserList.map((user) => (
            <StyledMenuItem
              key={user.targetUserId}
              button
              selected={subscribe.currUser.targetUserId === user.targetUserId}
              onClick={() => { subscribe.handleCurrTargetUser(user); handleClose(); }}
            >
              <Cached fontSize="small" style={{ marginRight: 16 }} />
              <ListItemText primary={user.targetUserId} />
            </StyledMenuItem>
          ))}
        </List>
      );
    }
    // 구독한 유저가 존재 하지 않을 경우
    return (
      <StyledMenuItem>
        <ListItemText primary="구독한 유저가 없습니다." />
      </StyledMenuItem>
    );
  };

  const tooltipText = (): JSX.Element => (
    <Typography
      style={{ fontSize: '17px', width: '500px', padding: '15px' }}
    >
      <EmojiObjectsOutlinedIcon style={{ fontSize: '24px', marginRight: '8px', color: 'yellow' }} />
      클릭하시면 구독한 유저를 선택 할 수 있습니다.
    </Typography>
  );

  return (
    <div>
      <StyledToolTip
        title={tooltipText()}
        placement="bottom-start"
        open={tooltipOpen}
        arrow
      >
        <Button onClick={handleClick} className={classes.useNameButton}>
          <Typography variant="h4" className={classes.title}>
            {subscribe.currUser.targetUserId}
          </Typography>
          <Typography variant="h4">
            님
          </Typography>
        </Button>
      </StyledToolTip>

      <StyledMenu
        id="customized-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        style={{ padding: '0px' }}
      >
        {subscribeUserListItem()}

      </StyledMenu>
    </div>
  );
}
