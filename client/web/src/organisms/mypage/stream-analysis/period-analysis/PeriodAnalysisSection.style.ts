import { Theme, makeStyles } from '@material-ui/core/styles';

const usePeriodAnalysisSectionStyles = makeStyles((theme: Theme) => ({
  root: { flexGrow: 1, padding: theme.spacing(4) },
  mainBody: {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(2),
    fontWeight: 'bold',
  },
  anlaysisButton: {
    width: '136.2px',
    height: '51.1px',
    borderRadius: '6px',
    backgroundColor: theme.palette.primary.dark,
    fontFamily: 'AppleSDGothicNeo',
    fontSize: '24px',
    marginTop: theme.spacing(3),
    marginRight: theme.spacing(10),
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
  },
}));

export default usePeriodAnalysisSectionStyles;
