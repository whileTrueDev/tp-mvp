import { Theme, makeStyles } from '@material-ui/core/styles';

const useStreamAnalysisStyles = makeStyles((theme: Theme) => ({
  analysisSectionPaper: {
    padding: `0 ${theme.spacing(2)}px`,
  },
  graphSectionPaper: {
    padding: `0 ${theme.spacing(2)}px`,
  },
}));

export default useStreamAnalysisStyles;
