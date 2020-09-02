import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Menu, { MenuProps } from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Cached from '@material-ui/icons/Cached';
import Typography from '@material-ui/core/Typography';
// styles
import useNavbarStyles from './Navbar.style';

const StyledMenu = withStyles({
  paper: {
    border: '1px solid #d3d4d5',
  },
})((props: MenuProps) => (
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

interface NavUserInfoInterface{
  username : string;
  subscribePerioud: string;
  // isSubscribe: boolean;
}
interface NavbarUserListProps{
  navUserInfoList: NavUserInfoInterface[];
  selectedUserIndex: number;
  handleSelectedUserIndex: (user: NavUserInfoInterface) => void;
}

export default function NavbarUserList(props: NavbarUserListProps): JSX.Element {
  const {
    navUserInfoList, handleSelectedUserIndex, selectedUserIndex
  } = props;
  const classes = useNavbarStyles();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const subscribeUserListItem = (): JSX.Element[] | JSX.Element => {
    // 구독한 유저가 1명이라도 존재 할 경우 (자기 자신 포함)
    if (navUserInfoList.length > 0) {
      return navUserInfoList.map((user) => (
        <StyledMenuItem key={user.username} onClick={() => handleSelectedUserIndex(user)}>
          <ListItemIcon>
            <Cached fontSize="small" />
          </ListItemIcon>
          <ListItemText primary={user.username} />
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
      <Button onClick={handleClick}>
        <Typography className={classes.title}>
          {navUserInfoList[selectedUserIndex].username}
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
