import React from 'react';
import { Link } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import MuiAppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Avatar from '@material-ui/core/Avatar';

import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import TruepointLogo from '../../atoms/TruepointLogo';
import UserMenuPopover from '../../atoms/UserMenuPopover';

import THEME_TYPE from '../../interfaces/ThemeType';

const APPBAR_HEIGHT = 100;

const useStyles = makeStyles((theme: Theme) => createStyles({
  root: {
    flexGrow: 1,
    background: theme.palette.primary.main,
    position: 'fixed',
    width: '100%',
    zIndex: 9999,
  },
  container: {
    display: 'block',
    position: 'sticky',
    width: 1400,
    height: APPBAR_HEIGHT,
    margin: '0 auto',
    boxShadow: 'none',
    padding: `${theme.spacing(2)}px 0px`,
  },
  toolbar: { display: 'flex', justifyContent: 'space-between', },
  links: { display: 'flex', alignItems: 'center' },
  link: {
    color: 'white', marginLeft: theme.spacing(2), marginRight: theme.spacing(4)
  },
  linkText: { fontWeight: 'bold', },
  logo: { marginRight: theme.spacing(4) },
  appbarSpace: { paddingTop: APPBAR_HEIGHT },
}));

export interface AppbarProps {
  themeType: THEME_TYPE;
  handleThemeChange: () => void;
}
export default function AppBar({
  themeType,
  handleThemeChange,
}: AppbarProps): JSX.Element {
  const classes = useStyles();
  const [UserMenuAnchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(UserMenuAnchorEl ? null : event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const UserMenuOpen = Boolean(UserMenuAnchorEl);

  return (
    <>
      <div className={classes.root}>
        <MuiAppBar className={classes.container}>
          <div className={classes.toolbar}>
            <div className={classes.links}>
              <TruepointLogo className={classes.logo} />
              <Button component={Link} to="/mypage/main" className={classes.link}>
                <Typography className={classes.linkText} variant="h6">마이페이지</Typography>
              </Button>
              <Button component={Link} to="/notice" className={classes.link}>
                <Typography className={classes.linkText} variant="h6">공지사항</Typography>
              </Button>
              <Button component={Link} to="/feature-suggestion" className={classes.link}>
                <Typography className={classes.linkText} variant="h6">기능제안</Typography>
              </Button>
            </div>

            <div>
              <Button variant="contained" color="secondary" style={{ color: 'white' }}>로그인</Button>
              <IconButton onClick={handleClick}>
                <Avatar />
              </IconButton>
              <UserMenuPopover
                open={UserMenuOpen}
                anchorEl={UserMenuAnchorEl}
                onClose={handleClose}
                themeType={themeType}
                handleThemeChange={handleThemeChange}
              />
            </div>
          </div>
        </MuiAppBar>
      </div>
      <div className={classes.appbarSpace} />
    </>
  );
}
