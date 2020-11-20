import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: 500,
    [theme.breakpoints.down('sm')]: {
      height: 400,
    },
  },
  mainSubTitle: {
    fontFamily: 'AppleSDGothicNeo',
    fontSize: 20,
    fontWeight: 600,
    padding: '30px 0px 5px 0px',
  },
  mainTitle: {
    fontFamily: 'AppleSDGothicNeo',
    fontSize: 25,
    fontWeight: 700,
    padding: '5px 0px 30px 0px',
  },
  slider: {
    '&>ul>li': {
      width: 50,
    },
    width: '95%',
    margin: 'auto',
  },
  front: {
    '&>*': {
      zIndex: 100,
    },
  },
  back: {
    zIndex: 1,
    height: 220,
    width: '100%',
    position: 'relative',
    top: -250,
    background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
    [theme.breakpoints.down('xs')]: {
      top: -170,
      height: 150,
    },
  },
  carousel: {
    paddingTop: 20,
    height: 250,
    outline: 'none',
    [theme.breakpoints.down('xs')]: {
      height: 170,
    },
  },
  content: {
    margin: 'auto',
    width: 250,
    height: '100%',
    background: 'white',
    boxShadow: '0px 0px 1px 1px #cfcfcf',
    [theme.breakpoints.down('xs')]: {
      width: 170,
    },
  },
  dot: {
    fontFamily: 'AppleSDGothicNeo',
    fontSize: 12,
    margin: 0,
  },
}));

export default styles;
