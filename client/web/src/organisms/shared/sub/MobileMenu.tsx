import {
  Typography, Button, SwipeableDrawer, List, ListItem, IconButton, Avatar, Grid,
} from '@material-ui/core';
import React from 'react';
import classnames from 'classnames';
import { useTheme } from '@material-ui/core/styles';
import CloseIcon from '@material-ui/icons/Close';
import { Link } from 'react-router-dom';
import { TruepointTheme } from '../../../interfaces/TruepointTheme';
import { useStyles } from '../styles/Appbar.style';
import DarkModeToggleButtonContent from './DarkModeToggleButtonContent';
import useAuthContext from '../../../utils/hooks/useAuthContext';
import TruepointLogo from '../../../atoms/TruepointLogo';

type LinkType = {
  name: string,
  path: string,
  activeRouteString: string | string[],
  hidden?: boolean
}

export interface MobileMenuProps{
  mobileMoreAnchorEl: HTMLElement | null,
  isMobileMenuOpen: boolean,
  handleMobileMenuClose: () => void
  links: LinkType[]
}

export default function MobileMenu(props: MobileMenuProps): JSX.Element {
  const {
    isMobileMenuOpen,
    handleMobileMenuClose,
    links,
  } = props;
  const authContext = useAuthContext();
  const classes = useStyles();
  const theme = useTheme<TruepointTheme>();
  return (
    <SwipeableDrawer
      anchor="right"
      open={isMobileMenuOpen}
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onOpen={() => {}}
      onClose={handleMobileMenuClose}
    >
      <List className={classes.mobileToggleList}>

        {/* 트루포인트 로고  */}
        <ListItem alignItems="center" style={{ justifyContent: 'center' }}>
          <TruepointLogo width={80} />
          <IconButton className={classes.mobileMenuCloseButton} aria-label="닫기" onClick={handleMobileMenuClose}>
            <CloseIcon />
          </IconButton>
        </ListItem>

        {/* 로그인 / 로그아웃 버튼 */}
        {authContext.user.userId && authContext.accessToken ? (

          <ListItem
            className={classes.menuItem}
            style={{ padding: '0 36px', marginBottom: '24px' }}
          >
            <Avatar
              className={classes.mobileMenuProfileImage}
              alt={authContext.user.nickName}
              src={authContext.user.profileImage}
            />
            <Grid container direction="column" justify="center" alignItems="flex-start">
              <Typography
                component={Link}
                to="/mypage"
                className={classes.mobileMenuProfileName}
              >
                {`${authContext.user.nickName} >`}

              </Typography>
              <Button
                className={classes.mobileToggleLogoutButton}
                onClick={authContext.handleLogout}
              >
                로그아웃
              </Button>
            </Grid>
          </ListItem>
        ) : (
          <ListItem className={classes.menuItem}>
            <Button
              variant="contained"
              color="primary"
              className={classes.mobileToggleLoginButton}
              component={Link}
              to="/login"
            >
              로그인 &gt;
            </Button>
          </ListItem>
        )}
        {authContext.user.userId.length > 1 && authContext.accessToken && (
        <ListItem
          className={classnames(classes.menuItem, classes.mobileText)}
          component={Link}
          to="/mypage"
          button
        >
          <Typography>마이페이지</Typography>
        </ListItem>
        )}
        {links.map((link) => (
          <ListItem
            key={link.path}
            className={classnames(classes.menuItem, classes.mobileText)}
            component={Link}
            to={link.path}
            button
          >
            <Typography>{link.name}</Typography>
          </ListItem>
        ))}

        <ListItem
          className={classnames(classes.menuItem, classes.mobileText, classes.darkModeToggleButton)}
          component={Button}
          onClick={theme.handleThemeChange}
          button
        >
          <DarkModeToggleButtonContent />
        </ListItem>

      </List>
    </SwipeableDrawer>
  );
}
