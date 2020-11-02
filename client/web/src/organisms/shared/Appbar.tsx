import React from 'react';
import { Link } from 'react-router-dom';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import MuiAppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';

import Button from '@material-ui/core/Button';
import TruepointLogo from '../../atoms/TruepointLogo';
import TruepointLogoLight from '../../atoms/TruepointLogoLight';
import useAuthContext from '../../utils/hooks/useAuthContext';
import { MYPAGE_MAIN_MAX_WIDTH, MYPAGE_MAIN_MIN_WIDTH } from '../../assets/constants';
import THEME_TYPE from '../../interfaces/ThemeType';

// type
import routes from '../../pages/mypage/routes';
import HeaderLinks from './sub/HeaderLinks';

const APPBAR_HEIGHT = 100;

const useStyles = makeStyles((theme) => createStyles({
  root: {
    flexGrow: 1,
    background: theme.palette.primary.main,
    position: 'fixed',
    width: '100%',
    zIndex: 1200,
  },
  container: {
    display: 'block',
    position: 'sticky',
    maxWidth: MYPAGE_MAIN_MAX_WIDTH,
    minWidth: MYPAGE_MAIN_MIN_WIDTH,
    height: APPBAR_HEIGHT,
    margin: '0 auto',
    boxShadow: 'none',
    padding: `${theme.spacing(2)}px ${theme.spacing(1)}px`,
    borderBottom: 'none',
  },
  toolbar: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%',
  },
  links: { display: 'flex', alignItems: 'center' },
  link: {
    color: 'white', marginLeft: theme.spacing(2), marginRight: theme.spacing(4),
  },
  linkText: { fontWeight: 'bold' },
  logo: { marginRight: theme.spacing(4) },
  appbarSpace: { paddingTop: APPBAR_HEIGHT },
  userInterfaceWrapper: {
    display: 'flex',
    flex: 1,
  },
  loginButton: {
    height: '40px',
    fontSize: '28px',
    width: '150px',
    borderRadius: 0,
  },
}));

export default function AppBar(): JSX.Element {
  const authContext = useAuthContext();
  const classes = useStyles();

  return (
    <>
      <div className={classes.root}>
        <MuiAppBar className={classes.container}>
          <div className={classes.toolbar}>
            <div className={classes.links}>
              {localStorage.getItem('themeType') === THEME_TYPE.LIGHT ? (
                <TruepointLogoLight className={classes.logo} />
              ) : (
                <TruepointLogo className={classes.logo} />
              )}

              {authContext.user.userId.length > 1 && (
              <Button component={Link} to="/mypage/main" className={classes.link}>
                <Typography className={classes.linkText} variant="h6">마이페이지</Typography>
              </Button>
              )}
              <Button component={Link} to="/notice" className={classes.link}>
                <Typography className={classes.linkText} variant="h6">공지사항</Typography>
              </Button>
              <Button component={Link} to="/feature-suggestion" className={classes.link}>
                <Typography className={classes.linkText} variant="h6">기능제안</Typography>
              </Button>
            </div>

            {authContext.user.userId ? (
              <div className={classes.userInterfaceWrapper}>
                <HeaderLinks routes={routes} />
              </div>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                className={classes.loginButton}
                component={Link}
                to="/login"
              >
                로그인
              </Button>
            )}

          </div>
        </MuiAppBar>
      </div>
      <div className={classes.appbarSpace} />
    </>
  );
}
