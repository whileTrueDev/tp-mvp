import { makeStyles } from '@material-ui/core/styles';
import {
  MAIN_HERO_HEIGHT, COMMON_APP_BAR_HEIGHT,
} from '../../../assets/constants';

const HEIGHT = MAIN_HERO_HEIGHT + COMMON_APP_BAR_HEIGHT; // 기존 hero 영역 높이 + Appbar가 차지하던 높이. (뱀비늘배경을 앱바에도 보이도록 하기 위한 조치) by hwasurr

const styles = makeStyles((theme) => {
  const smSizeHeight = theme.spacing(12);
  return ({
    root: {
      width: '100%',
      height: HEIGHT,
      [theme.breakpoints.down('sm')]: {
        height: smSizeHeight,
      },
      backgroundColor: theme.palette.background.paper,
    },
    heroBg: {
      height: HEIGHT,
      [theme.breakpoints.down('sm')]: {
        height: smSizeHeight,
      },
      backgroundImage: 'url(/images/feature-suggestion/fish_scales_bg.png)',
      backgroundRepeat: 'repeat',
      backgroundSize: '50%',
    },
    wraper: {
      width: 968,
      [theme.breakpoints.down('sm')]: {
        width: '100%',
      },
      padding: 0,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'stretch',
      height: 'inherit',
      position: 'relative',
    },
    heroLogo: {
      height: HEIGHT,
      background: theme.palette.type === 'light'
        ? ('url("/images/logo/logo_truepoint_v2_desert_light.png")')
        : ('url("/images/logo/logo_truepoint_v2_desert_dark.png")'),
      backgroundSize: 'contain',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      [theme.breakpoints.down('sm')]: {
        backgroundSize: theme.spacing(50),
      },
    },
    main: {
      // margin: '20px 0px 20px 0px',
    },
    mainExcept: {
      margin: '20px 0px 20px 0px',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    mainTitle: {

      fontSize: 60,
      fontWeight: 900,
      color: theme.palette.type === 'dark' ? theme.palette.common.black : theme.palette.common.white,
      margin: 0,
    },
    mainContent: {

      fontSize: 20,
      margin: 0,
      color: theme.palette.type === 'dark' ? theme.palette.common.black : theme.palette.common.white,
    },
    button: {

      color: theme.palette.type === 'dark' ? theme.palette.common.black : theme.palette.common.white,
      border: `1px solid ${theme.palette.type === 'dark' ? theme.palette.common.black : theme.palette.common.white}`,
      borderRadius: 0,
      width: 150,
    },
    buttonLine: {
      animation: '$lineSpread 1.2s ease-in-out',
      borderBottom: `1px solid ${theme.palette.type === 'dark' ? theme.palette.common.black : theme.palette.common.white}`,
      width: 500,
    },
    logoEffect: {
      animationDelay: '1.5s',
      animationIterationCount: 'infinite',
      animation: '$logoEffect 1s ease-in-out',
      width: 200,
      height: 200,
      visibility: 'hidden',
      position: 'relative',
      background: 'url(\'./images/logo/truepointLogo.png\') no-repeat center center',
    },
    '@keyframes lineSpread': {
      '0%': {
        width: 0,
      },
      '100%': {
        width: 500,
      },
    },
    '@keyframes logoEffect': {
      '0%': {
        visibility: 'visible',
        top: 0,
      },
      '50%': {
        top: -10,
      },
      '100%': {
        top: -0,
      },
    },
  });
});

export default styles;
