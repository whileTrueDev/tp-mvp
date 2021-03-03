import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: 500,
    background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    [theme.breakpoints.down('sm')]: {
      height: 400,
    },
  },
  wraper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    height: 500,
    [theme.breakpoints.down('sm')]: {
      height: 400,
    },
  },
  main: {
    margin: '20px 0px 20px 0px',
  },
  mainTitle: {
    fontSize: 55,
    fontWeight: 900,
    color: theme.palette.type === 'dark' ? theme.palette.common.black : theme.palette.common.white,
    margin: 0,
    [theme.breakpoints.down('md')]: {
      wordBreak: 'keep-all',
      fontSize: 40,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: 32,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 25,
    },
  },
  mainContent: {
    fontSize: 20,
    margin: 0,
    color: theme.palette.type === 'dark' ? theme.palette.common.black : theme.palette.common.white,
    [theme.breakpoints.down('md')]: {
      wordBreak: 'keep-all',
    },
  },
  imgWraper: {
    animationDelay: '1s',
    animation: '$wraperEffect 2s ease-in-out',
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  mainSVGEffect: {
    animationDelay: '1s',
    animationIterationCount: 'infinite',
    animation: '$mainSVGEffect 2s ease-in-out',
    visibility: 'hidden',
    position: 'relative',
  },
  subSVGEffect: {
    width: 350,
    animationDelay: '1s',
    animationIterationCount: 'infinite',
    animation: '$subSVGEffect 2s ease-in-out',
    visibility: 'hidden',
    position: 'relative',
    marginTop: theme.spacing(4),
  },
  '@keyframes lineSpread': {
    '0%': {
      width: 0,
    },
    '100%': {
      width: '100%',
    },
  },
  '@keyframes wraperEffect': {
    '0%': {
      opacity: 0,
    },
    '100%': {
      opacity: 1,
    },
  },
  '@keyframes mainSVGEffect': {
    '0%': {
      visibility: 'visible',
      top: 0,
    },
    '50%': {
      top: -20,
    },
    '100%': {
      top: -0,
    },
  },
  '@keyframes subSVGEffect': {
    '0%': {
      visibility: 'visible',
      width: 350,
    },
    '50%': {
      width: 300,
    },
    '100%': {
      width: 350,
    },
  },
  mainExcept: {
    margin: '20px 0px 20px 0px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    color: theme.palette.type === 'dark' ? theme.palette.common.black : theme.palette.common.white,
    border: `1px solid ${theme.palette.type === 'dark' ? theme.palette.common.black : theme.palette.common.white}`,
    borderRadius: 0,
    width: 150,
  },
  buttonLine: {
    animation: '$lineSpread 0.5s ease-in-out',
    borderBottom: `1px solid ${theme.palette.type === 'dark' ? theme.palette.common.black : theme.palette.common.white}`,
    width: '100%',
    [theme.breakpoints.down('md')]: {
      width: '100%',
    },
  },
}));

export default styles;
