import { Theme, makeStyles } from '@material-ui/core/styles';

const useStreamAnalysisStyles = makeStyles((theme: Theme) => ({
  analysisSectionPaper: {
    padding: `0 ${theme.spacing(2)}px`,
    marginBottom: theme.spacing(2),
  },
  graphSectionPaper: {
    padding: `0 ${theme.spacing(2)}px`,
    marginBottom: theme.spacing(2),
  },
}));

export default useStreamAnalysisStyles;
