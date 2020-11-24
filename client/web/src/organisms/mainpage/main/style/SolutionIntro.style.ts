import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  root: {
    width: '100%',
    margin: `${theme.spacing(15)}px 0px ${theme.spacing(4)}px 0px`,
  },
  mainTitle: {
    fontFamily: 'AppleSDGothicNeo',
    fontSize: 40,
    fontWeight: 700,
    margin: '30px 0px 30px 0px',
    [theme.breakpoints.down('xs')]: {
      fontSize: 28,
      textAlign: 'center',
      wordBreak: 'keep-all',
    },
  },
  solutionWraper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  solution: {
    width: '100%',
    margin: `${theme.spacing(8)}px 0px`,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'space-around',
    },
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  mainContent: {
    wordBreak: 'keep-all',
  },
  eachTitle: {
    fontFamily: 'AppleSDGothicNeo',
    fontSize: 30,
    fontWeight: 700,
    [theme.breakpoints.down('sm')]: {
      fontSize: 25,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 20,
    },
  },
  eachContent: {
    fontFamily: 'AppleSDGothicNeo',
    fontSize: 25,
    margin: `${theme.spacing(1)}px 0px`,
    [theme.breakpoints.down('sm')]: {
      fontSize: 20,
    },
    [theme.breakpoints.down('xs')]: {
      fontSize: 15,
    },
  },
  stepSVG: {
    width: 400,
    height: 400,
    margin: `0px ${theme.spacing(8)}px`,
    [theme.breakpoints.down('md')]: {
      width: 350,
      height: 350,
      margin: `0px ${theme.spacing(6)}px`,
    },
    [theme.breakpoints.down('sm')]: {
      width: 250,
      height: 250,
      margin: `0px ${theme.spacing(4)}px`,
    },
    [theme.breakpoints.down('xs')]: {
      width: 220,
      height: 220,
      margin: `0px ${theme.spacing(2)}px`,
    },
  },
  stepOneLine: {
    width: 0,
    height: 150,
    borderRight: `8px solid ${theme.palette.primary.light}`,
    borderRadius: 4,
    margin: `0px ${theme.spacing(4)}px`,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  stepTwoLine: {
    width: 200,
    height: 0,
    borderRadius: 4,
    borderBottom: `8px solid ${theme.palette.primary.light}`,
    margin: `0px ${theme.spacing(4)}px`,
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  stepThreeLine: {
    width: 0,
    height: 250,
    borderRadius: 4,
    borderRight: `8px solid ${theme.palette.primary.light}`,
    margin: '0px 15px 0px 15px',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  accent: {
    color: theme.palette.primary.light,
    fontFamily: 'AppleSDGothicNeo',
    fontSize: 27,
    fontWeight: 700,
    textAlign: 'center',
    [theme.breakpoints.down('xs')]: {
      fontSize: 20,
    },
  },
  mainBottomLine: {
    width: 0,
    borderRight: `2px dotted ${theme.palette.primary.light}`,
    height: '150px',
    margin: '40px 0px 30px 0px',
    [theme.breakpoints.down('sm')]: {
      height: '100px',
    },
    [theme.breakpoints.down('xs')]: {
      height: '80px',
    },
  },
  finishComment: {
    fontFamily: 'AppleSDGothicNeo',
    fontSize: 40,
    fontWeight: 800,
    textAlign: 'center',
    wordBreak: 'keep-all',
    margin: `${theme.spacing(3)}px 0px `,
    [theme.breakpoints.down('sm')]: {
      fontSize: 30,
    },
  },
  arrowSVG: {
    width: 50,
    height: 25,
    fill: 'none',
    stroke: theme.palette.primary.light,
    strokeWidth: '5px',
    marginTop: 30,
  },
}));

export default styles;
