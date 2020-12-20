import { Theme, makeStyles } from '@material-ui/core/styles';

const usePeriodCompareStyles = makeStyles((theme: Theme) => ({
  root: { flexGrow: 1, padding: theme.spacing(4) },
  mainBody: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
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
    fontSize: '24px',
    marginTop: theme.spacing(3),
    marginRight: theme.spacing(10),
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
  },
}));

export default usePeriodCompareStyles;
