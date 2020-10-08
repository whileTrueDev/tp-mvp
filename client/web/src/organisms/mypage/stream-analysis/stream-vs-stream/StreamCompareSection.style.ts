import { Theme, makeStyles } from '@material-ui/core/styles';

const useStreamSectionStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    marginTop: '135px',
    height: '700px'
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
    marginBottom: '28px',
  },
  mainBody: {
    color: '#4d4f5c',
    letterSpacing: 'normal',
    textAlign: 'left',
    lineHeight: 1.5,
    fontSize: '22px',
    fontFamily: 'SourceSansPro',
    marginBottom: '28px',
  },
  bodyPapper: {
    borderRadius: '12px',
    border: 'solid 1px #707070',
    backgroundColor: '#ffffff',
    width: '276px',
    height: '75px',
    paddingTop: '22.5px',
    paddingBottom: '10.5px',
    boxShadow: '0'
  },
  subTitle: {
    color: '#4d4f5c',
    letterSpacing: 'normal',
    textAlign: 'left',
    lineHeight: 1.5,
    fontSize: '22px',
    fontFamily: 'SourceSansPro',
    marginLeft: '45.5px',
    display: 'flex',
    alignItems: 'center'
  },
  bodyWrapper: {
    borderRadius: '12px',
    hegith: '292px',
    border: 'solid 1px #707070',
    backgroundColor: '#ffffff',
    paddingTop: '22.5px',
    paddingBottom: '18.5px',
    paddingRight: '0px',
    marginRight: '42px',
  },
  bodyTitle: {
    color: '#4d4f5c',
    letterSpacing: 'normal',
    textAlign: 'center',
    lineHeight: 1.5,
    fontSize: '17px',
    fontFamily: 'SourceSansPro',
    marginLeft: '45.5px',
    marginRight: '35.5px',
    display: 'flex',
    marginBottom: '5px',
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

export default useStreamSectionStyles;
