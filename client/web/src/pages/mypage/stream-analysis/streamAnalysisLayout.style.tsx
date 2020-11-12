import { Theme, makeStyles } from '@material-ui/core/styles';

const useStreamAnalysisStyles = makeStyles((theme: Theme) => ({
  analysisSectionPaper: {
    padding: theme.spacing(5),
    marginBottom: theme.spacing(2),
  },
  graphSectionPaper: {
    padding: theme.spacing(5),
  },
}));

export default useStreamAnalysisStyles;
