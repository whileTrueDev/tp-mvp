import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: `${theme.spacing(4)}px 0px`,
  },
  wraper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainTopLine: {
    width: 0,
    borderRight: `2px dotted ${theme.palette.primary.light}`,
    height: '150px',
    [theme.breakpoints.down('sm')]: {
      height: '100px',
    },
    [theme.breakpoints.down('xs')]: {
      height: '80px',
    },
  },
  mainTitle: {
    fontFamily: 'AppleSDGothicNeo',
    marginTop: 20,
    fontSize: 30,
    fontWeight: 500,
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      fontSize: 25,
    },
    wordBreak: 'keep-all',
  },
  mainContent: {
    fontFamily: 'AppleSDGothicNeo',
    fontSize: 20,
    margin: `${theme.spacing(3)}px 0px ${theme.spacing(5)}px 0px`,
    [theme.breakpoints.down('xs')]: {
      fontSize: 16,
    },
  },
  logoWraper: {
    width: 500,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      width: 300,
    },
  },
  logo: {
    width: 100,
    hegiht: 100,
    [theme.breakpoints.down('xs')]: {
      width: 60,
      hegiht: 60,
    },
  },
}));

export default styles;
