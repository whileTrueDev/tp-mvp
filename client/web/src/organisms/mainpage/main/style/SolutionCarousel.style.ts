import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  root: {
    width: '100%',
    height: 500
  },
  mainSubTitle: {
    fontFamily: 'AppleSDGothicNeo',
    fontSize: 20,
    fontWeight: 600,
    padding: '30px 0px 5px 0px'
  },
  mainTitle: {
    fontFamily: 'AppleSDGothicNeo',
    fontSize: 25,
    fontWeight: 700,
    padding: '5px 0px 30px 0px'
  },
  slider: {
    '&>ul>li': {
      width: 80
    }
  },
  front: {
    '&>*': {
      zIndex: 200
    },
  },
  back: {
    zIndex: 1,
    height: 250,
    width: '100%',
    position: 'relative',
    top: -350,
    background: `linear-gradient(to bottom, ${theme.palette.primary.main}, ${theme.palette.primary.light})`
  },
  carousel: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    height: 350,
  },
  content: {
    margin: 'auto',
    width: '90%',
    height: '85%',
    background: 'white',
    boxShadow: '0px 0px 2px 1px #cfcfcf'
  },
  dot: {
    fontFamily: 'AppleSDGothicNeo',
    width: 80,
    height: 40
  }
}));

export default styles;
