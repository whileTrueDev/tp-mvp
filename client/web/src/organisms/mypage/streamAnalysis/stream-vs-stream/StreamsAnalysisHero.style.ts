import { Theme, makeStyles } from '@material-ui/core/styles';

const useStreamHeroStyles = makeStyles((theme: Theme) => ({

  root: {
    flexGrow: 1,
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
    paddingBottom: '20.5px'
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
    border: 'solid 1px #707070',
    backgroundColor: '#ffffff',
    paddingTop: '22.5px',
    paddingBottom: '28.5px',
    paddingRight: '0px',
    marginRight: '42px',
  },
  bodyTitle: {
    color: '#4d4f5c',
    letterSpacing: 'normal',
    textAlign: 'left',
    lineHeight: 1.5,
    fontSize: '17px',
    fontFamily: 'SourceSansPro',
    marginLeft: '45.5px',
    display: 'flex',
    marginBottom: '5px',
  },
}));

export default useStreamHeroStyles;
