import { Theme, makeStyles } from '@material-ui/core/styles';

const usePeriodCompareStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(6),
  },
  mainTitle: {
    color: theme.palette.text.primary,
    letterSpacing: '-1.2px',
    textAlign: 'left',
    lineHeight: 1.33,
    fontWeight: 500,
    fontSize: '30px',
    fontFamily: 'AppleSDGothicNeo',
    marginBottom: theme.spacing(5),
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
    marginBottom: theme.spacing(4),
  },
  bodyContainer: {
    marginRight: theme.spacing(4),
    marginTop: theme.spacing(8),
  },
  bodyPapper: {
    marginTop: theme.spacing(8),
    border: `solid 1px ${theme.palette.divider}`,
    borderRadius: '10px',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2),
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
    marginRight: theme.spacing(1),
  },
  bodyTitleIcon: {
    fontSize: '28px',
    marginRight: theme.spacing(2),
  },
  calendarWrapper: { marginTop: theme.spacing(2) },
  vsText: {
    fontFamily: 'AppleSDGothicNeo',
    fontSize: '30px',
    fontWeight: 'bold',
    paddingTop: '40px',
    marginRight: '32px',
  },
  categoryTitle: { marginTop: theme.spacing(15) },
  anlaysisButton: {
    width: '136.2px',
    height: '51.1px',
    borderRadius: '6px',
    backgroundColor: theme.palette.primary.dark,
    fontFamily: 'AppleSDGothicNeo',
    fontSize: '24px',
    marginTop: theme.spacing(3),
    marginRight: theme.spacing(10),
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
  },
  alert: {
    borderRadius: '5px',
    marginBottom: theme.spacing(2),
    paddingTop: theme.spacing(1),
  },
}));

export default usePeriodCompareStyles;
