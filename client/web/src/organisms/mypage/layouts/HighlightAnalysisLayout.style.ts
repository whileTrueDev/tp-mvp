import { makeStyles } from '@material-ui/core';

const useHighlightAnalysisLayoutStyles = makeStyles((theme) => ({
  root: { padding: theme.spacing(5) },
  wraper: { padding: theme.spacing(4) },
  calendarWrapper: {
    padding: theme.spacing(2),
    borderRadius: '12px',
    // hegith: '292px',
    border: `solid 1px ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    margin: theme.spacing(4),
    marginTop: theme.spacing(1),
    maxWidth: '80%',
  },
  sideSpace: {
    padding: `0px ${theme.spacing(6)}px`,
  },
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
    fontSize: 16,
    margin: 8,
    marginLeft: theme.spacing(2),
  },
  card: {
    textAlign: 'center',
    background: theme.palette.action.focus,
    borderRadius: 6,
    width: 280,
    display: 'inline-flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    '&:hover': {
      transform: 'scale(1.03)',
      boxShadow: theme.shadows[5],
    },
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    padding: `${theme.spacing(1)}px ${theme.spacing(0)}px`,
  },
  searchTitle: {
    marginTop: theme.spacing(2),
  },
  searchBox: { margin: theme.spacing(4) },
  analysisButton: { textAlign: 'right', paddingBottom: theme.spacing(2) },
  helperPopOver: { textAlign: 'right' },
}));

export default useHighlightAnalysisLayoutStyles;
