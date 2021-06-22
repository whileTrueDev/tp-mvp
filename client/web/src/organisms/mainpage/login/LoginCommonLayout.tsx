import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import LoginFooter from '../../shared/FooterShort';
import useScrollTop from '../../../utils/hooks/useScrollTop';
import createPostItStyles from '../../../utils/style/createPostitStyles';
import Appbar from '../../shared/Appbar';
import {
  COMMON_APP_BAR_HEIGHT, LOGIN_PAGE_SECTION_MAX_WIDTH, LOGIN_PAGE_SECTION_MIN_WIDTH, SM_APP_BAR_HEIGHT,
} from '../../../assets/constants';

const useStyles = makeStyles((theme) => ({
  container: {
    paddingTop: theme.spacing(6),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(1),
    },
    overflow: 'hidden',
    backgroundColor: theme.palette.primary.main,
    height: '100vh',
  },
  section: {
    position: 'relative',
    width: '100%',
    margin: '0 auto',
    maxWidth: LOGIN_PAGE_SECTION_MAX_WIDTH,
    minWidth: LOGIN_PAGE_SECTION_MIN_WIDTH,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: theme.palette.background.paper,
    height: '100%',
    '&:before': createPostItStyles(theme, 'left top'),
    '&:after': createPostItStyles(theme, 'right bottom'),
  },
  centerflex: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    height: '100%',
    padding: theme.spacing(0, 0.5),
    paddingTop: COMMON_APP_BAR_HEIGHT + theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      paddingTop: SM_APP_BAR_HEIGHT + theme.spacing(2),
    },
    overflowY: 'auto',
    overflowX: 'hidden',

  },

}));

interface Props {
  children? : React.ReactNode;
  footer?: boolean;
}
export default function LoginCommonLayout(props: Props): JSX.Element {
  const { children, footer = true } = props;
  const classes = useStyles();
  useScrollTop();
  return (
    <section className={classes.container}>
      <Appbar
        appbarSpace={false}
        mobileNavigation={false}
      />
      <section
        className={classes.section}
      >
        <div className={classes.centerflex}>
          {children}
        </div>
        {footer && <LoginFooter />}
      </section>

    </section>
  );
}
