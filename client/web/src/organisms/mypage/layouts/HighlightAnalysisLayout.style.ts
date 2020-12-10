import { makeStyles } from '@material-ui/core';

const useHighlightAnalysisLayoutStyles = makeStyles((theme) => ({
  root: { padding: theme.spacing(4) },
  wraper: { padding: `0 ${theme.spacing(2)}px` },
  title: {
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.spacing(1)}px ${theme.spacing(0)}px`,
  },
  titleText: { fontWeight: 'bold', lineHeight: theme.typography.h6.lineHeight },
  chip: {
    marginLeft: theme.spacing(1), marginRight: theme.spacing(1),
  },
  searchTitle: { marginTop: theme.spacing(2) },
  analysisButton: { textAlign: 'right', paddingBottom: theme.spacing(2) },
  helperPopOver: { textAlign: 'right' },
}));

export default useHighlightAnalysisLayoutStyles;
