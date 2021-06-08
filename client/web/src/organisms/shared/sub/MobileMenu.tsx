import {
  Typography, Button, SwipeableDrawer, List, ListItem, IconButton,
} from '@material-ui/core';
import React from 'react';
import classnames from 'classnames';
import { useTheme } from '@material-ui/core/styles';
import { Dashboard } from '@material-ui/icons';
import CloseIcon from '@material-ui/icons/Close';
import { Link } from 'react-router-dom';
import HeaderLinks from './HeaderLinks';
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
      <List style={{ width: theme.spacing(20) }}>
        <ListItem alignItems="center" style={{ justifyContent: 'space-between', backgroundColor: theme.palette.primary.main }}>
          <TruepointLogo width={60} />
          <IconButton aria-label="닫기" onClick={handleMobileMenuClose}>
            <CloseIcon />
          </IconButton>
        </ListItem>
        {authContext.user.userId.length > 1 && authContext.accessToken && (
        <ListItem
          className={classnames(classes.menuItem, classes.mobileTextMyPage)}
          component={Link}
          to="/mypage/main"
          button
        >
          <Dashboard className={classes.mobileIcon} />
          <Typography>마이페이지</Typography>
        </ListItem>
        )}
        {links.slice(1).map((link) => (
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

        {authContext.user.userId && authContext.accessToken ? (
          <>
            {/* <ListItem className={classes.menuItem}>
              <div className={classes.userInterfaceWrapper}>
                <HeaderLinks />
              </div>
            </ListItem> */}
            <ListItem className={classes.menuItem}>
              <Button
                variant="contained"
                color="secondary"
                className={classes.loginButton}
                onClick={authContext.handleLogout}
              >
                로그아웃
              </Button>
            </ListItem>
          </>
        ) : (
          <ListItem className={classes.menuItem}>
            <Button
              variant="contained"
              color="secondary"
              className={classes.loginButton}
              component={Link}
              to="/login"
            >
              로그인
            </Button>
          </ListItem>
        )}
      </List>
    </SwipeableDrawer>
  );
}
