import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primary.main,
    padding: theme.spacing(10, 10),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(10, 1),
    },
  },
  wraper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginRight: theme.spacing(3),
    [theme.breakpoints.between('sm', 'xs')]: {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  titleWrap: {
    marginBottom: theme.spacing(5),
  },
  mainTitle: {
    fontWeight: theme.typography.fontWeightBold,
    [theme.breakpoints.down('md')]: {
      fontSize: 20,
    },
    [theme.breakpoints.only('sm')]: {
      fontSize: 17,
    },
  },
  mainContent: {
    fontWeight: theme.typography.fontWeightBold,
    [theme.breakpoints.down('md')]: {
      fontSize: 20,
    },
    [theme.breakpoints.only('sm')]: {
      fontSize: 17,
    },
  },
  introVideoWrap: {
    position: 'relative',
    width: '75%',
    paddingTop: 'calc(100*0.5635*0.75%)',
    margin: '0px auto',
    [theme.breakpoints.down('sm')]: {
      width: '90%',
      paddingTop: 'calc(100*0.5635*0.9%)',
    },
    [theme.breakpoints.down('xs')]: {
      width: '100%',
      paddingTop: 'calc(100*0.5635*1%)',
      margin: `${theme.spacing(5)}px auto`,
    },
  },
  introVideo: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    visibility: 'hidden',
  },
  introVideoReady: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    animation: '$flow 0.5s ease-in-out forwards',
    visibility: 'visible',
  },
  '@keyframes flow': {
    '0%, 50%': {
      visibility: 'hidden',
      transform: 'translate(0%, 10%)',
      opacity: 0,
    },
    '100%': {
      visibility: 'visible',
      transform: 'translate(0%, 0%)',
      opacity: 1,
    },
  },
}));

export default styles;
