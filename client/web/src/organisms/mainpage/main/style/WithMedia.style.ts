import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  root: {
    width: '100%',
    padding: '30px 0px 30px 0px'
  },
  wraper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainTopLine: {
    width: 0,
    borderRight: `2px dotted ${theme.palette.primary.light}`,
    height: '150px'
  },
  mainTitle: {
    fontFamily: 'AppleSDGothicNeo',
    marginTop: 20,
    fontSize: 30,
    fontWeight: 500
  },
  mainContent: {
    fontFamily: 'AppleSDGothicNeo',
    fontSize: 20,
    margin: '20px 0px 40px 0px'
  },
  logoWraper: {
    width: 500,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  logo: {
    width: 100,
    hegiht: 100
  }
}));

export default styles;
