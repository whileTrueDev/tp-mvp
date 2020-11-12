import { makeStyles } from '@material-ui/core';

const useHighlightAnalysisLayoutStyles = makeStyles((theme) => ({
  root: { padding: theme.spacing(4) },
  sub: {
    fontSize: 22,
    color: theme.palette.text.secondary,
  },
  checkedStream: {
    padding: 30,
  },
  checkedStreamFont: {
    fontSize: 22,
    fontweight: 'bold',
    color: theme.palette.text.secondary,
  },
  cardText: {
    fontSize: 15,
    margin: 8,
    // color: theme.palette.text.secondary,
  },
  card: {
    margin: `0px ${theme.spacing(4)}px`,
    textAlign: 'center',
    background: theme.palette.action.focus,
    borderRadius: 6,
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    padding: `${theme.spacing(1)}px ${theme.spacing(4)}px`,
  },
}));

export default useHighlightAnalysisLayoutStyles;
