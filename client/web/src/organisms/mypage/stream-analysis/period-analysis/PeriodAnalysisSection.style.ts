import { Theme, makeStyles } from '@material-ui/core/styles';

const usePeriodAnalysisSectionStyles = makeStyles((theme: Theme) => ({
  root: { flexGrow: 1, padding: theme.spacing(4) },
  mainBody: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    fontWeight: 'bold',
  },
  calendarWrapper: { marginTop: theme.spacing(2) },
  categoryTitle: { marginTop: theme.spacing(10), fontWeight: 'bold' },
  anlaysisButton: {
    width: '136.2px',
    height: '51.1px',
    borderRadius: '6px',
    backgroundColor: theme.palette.primary.dark,
    fontSize: '24px',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
  },
}));

export default usePeriodAnalysisSectionStyles;
