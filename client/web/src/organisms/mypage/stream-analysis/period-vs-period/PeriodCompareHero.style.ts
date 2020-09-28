import { Theme, makeStyles } from '@material-ui/core/styles';

const useperiodCompareStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    marginTop: '135px',
    // height: '700px'
  },
  titleDivider: {
    backgroundColor: '#4b5ac7',
    width: '200px',
    marginBottom: '12px',
    height: '3px'
  },
  mainTitle: {
    color: '#000000',
    letterSpacing: '-1.2px',
    textAlign: 'left',
    lineHeight: 1.33,
    fontWeight: 500,
    fontSize: '30px',
    fontFamily: 'AppleSDGothicNeo',
    marginBottom: '60px',
  },
  infoText: {
    color: '#4d4f5c',
    fontFamily: 'AppleSDGothicNeo',
    fontSize: '12px',
    lineHeight: '1.11',
    textAlign: 'right'
  },
  mainBody: {
    color: '#4d4f5c',
    letterSpacing: '-1.2px',
    textAlign: 'left',
    lineHeight: 0.87,
    fontWeight: 500,
    fontSize: '23px',
    fontFamily: 'AppleSDGothicNeo',
    marginBottom: '28px',
  },
  bodyContainer: {
    marginRight: '30px',
    marginTop: '60px'
  },
  bodyPapper: {
    marginTop: '60px',
    border: 'solid 1px #707070',
    borderRadius: '10px',
    paddingTop: '27px',
    paddingBottom: '20px'
  },
  bodyTitle: {
    fontSize: '19px',
    fontFamily: 'SourceSansPro',
    lineHeight: 1.53,
    color: '#4d4f5c',
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center'
  },
  bodyTitleHighlite: {
    fontSize: '19px',
    fontWeight: 'bold',
    marginRight: '5px'
  },
  bodyTitleIcon: {
    fontSize: '28px',
    marginRight: '18px'
  },
  vsText: {
    color: '#4d4f5c',
    letterSpacing: '-1.2px',
    textAlign: 'left',
    lineHeight: 0.67,
    fontWeight: 500,
    fontSize: '30px',
    fontFamily: 'AppleSDGothicNeo',
    marginBottom: '28px',
    marginRight: '30px',
    marginTop: '80px'
  },
  anlaysisButton: {
    width: '136.2px',
    height: '51.1px',
    borderRadius: '6px',
    backgroundColor: theme.palette.primary.dark,
    fontFamily: 'SourceSansPro',
    fontSize: '24px',
    marginTop: '20px',
    color: '#ffff',
    marginRight: '93.5px'
  },
  alert: {
    borderRadius: '5px',
    marginBottom: '12px',
    paddingTop: '4px'
  }
}));

export default useperiodCompareStyles;
