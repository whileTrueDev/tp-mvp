import { Theme, makeStyles } from '@material-ui/core/styles';

const usePeriodCompareStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(6),
  },
  titleDivider: {
    backgroundColor: theme.palette.primary.main,
    width: '200px',
    marginBottom: '12px',
    height: '3px',
  },
  mainTitle: {
    color: theme.palette.text.primary,
    letterSpacing: '-1.2px',
    textAlign: 'left',
    lineHeight: 1.33,
    fontWeight: 500,
    fontSize: '30px',
    fontFamily: 'AppleSDGothicNeo',
    marginBottom: '60px',
  },
  infoText: {
    color: theme.palette.text.secondary,
    fontFamily: 'AppleSDGothicNeo',
    fontSize: '18px',
    lineHeight: '1.11',
    textAlign: 'right',
    marginRight: '110px',
  },
  mainBody: {
    color: theme.palette.text.secondary,
    letterSpacing: '-1.2px',
    textAlign: 'left',
    lineHeight: 0.87,
    fontWeight: 'bold',
    fontSize: '23px',
    fontFamily: 'AppleSDGothicNeo',
    marginBottom: '28px',
  },
  bodyContainer: {
    marginRight: '30px',
    marginTop: '60px',
  },
  bodyPapper: {
    marginTop: '60px',
    border: `solid 1px ${theme.palette.divider}`,
    borderRadius: '10px',
    paddingTop: '27px',
    paddingBottom: '20px',
  },
  bodyTitle: {
    fontSize: '19px',
    fontFamily: 'AppleSDGothicNeo',
    lineHeight: 1.53,
    color: theme.palette.text.secondary,
    display: 'flex',
    justifyContent: 'center',
    textAlign: 'center',
  },
  bodyTitleHighlite: {
    fontSize: '19px',
    fontWeight: 'bold',
    marginRight: '5px',
  },
  bodyTitleIcon: {
    fontSize: '28px',
    marginRight: '18px',
  },
  vsText: {
    color: theme.palette.text.secondary,
    letterSpacing: '-1.2px',
    textAlign: 'left',
    lineHeight: 0.67,
    fontWeight: 500,
    fontSize: '30px',
    fontFamily: 'AppleSDGothicNeo',
    marginBottom: '28px',
    marginRight: '30px',
    marginTop: '80px',
  },
  anlaysisButton: {
    width: '136.2px',
    height: '51.1px',
    borderRadius: '6px',
    backgroundColor: '#4b5ac7',
    fontFamily: 'AppleSDGothicNeo',
    fontSize: '24px',
    marginTop: theme.spacing(3),
    marginRight: '93.5px',
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
  },
  alert: {
    borderRadius: '5px',
    marginBottom: '12px',
    paddingTop: '4px',
  },
}));

export default usePeriodCompareStyles;
