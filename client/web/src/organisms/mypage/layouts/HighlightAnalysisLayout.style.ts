import { makeStyles } from '@material-ui/core';

const useHighlightAnalysisLayoutStyles = makeStyles((theme) => ({
  root: { padding: theme.spacing(4) },
  title: {
    fontWeight: 'bold',
    fontSize: '30px'
  },
  sub: {
    fontSize: 22,
    color: theme.palette.text.secondary
  },
  checkedStream: {
    padding: 30
  },
  checkedStreamFont: {
    fontSize: 22,
    fontweight: 'bold',
    color: theme.palette.text.secondary
  },
  cardText: {
    fontsize: 40,
    fontWeight: 'bold',
    color: theme.palette.text.secondary
  },
  card: {
    height: '2vw',
    paddingTop: 6,
    textAlign: 'center',
    background: '#e4e4e4'
  }
}));

export default useHighlightAnalysisLayoutStyles;
