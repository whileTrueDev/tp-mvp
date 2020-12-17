import { makeStyles } from '@material-ui/core';

const useHighlightAnalysisLayoutStyles = makeStyles((theme) => ({
  root: { padding: theme.spacing(4) },
  wraper: {
    margin: `0 ${theme.spacing(2)}px`,
    width: '90%',
  },
  calendarWrapper: {
    padding: theme.spacing(2),
    borderRadius: '12px',
    border: `solid 1px ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    margin: theme.spacing(4),
    width: '97%',
  },
  sideSpace: {
    margin: `0px ${theme.spacing(4)}px`,
    width: '80%',
  },
  sub: {
    fontSize: 22,
    color: theme.palette.text.secondary,
  },
  checkedStream: {
    padding: 30,
  },
  listItemText: {
    fontFamily: 'AppleSDGothicNeo',
    color: theme.palette.text.primary,
    textAlign: 'left',
    lineHeight: '2.06',
    fontSize: '16px',
    fontWeight: 500,
    marginRight: theme.spacing(2),
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
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    '&:hover': {
      transform: 'scale(1.03)',
      boxShadow: theme.shadows[5],
    },
  },
  cardInner: {
    paddingLeft: theme.spacing(2),
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    display: 'flex',
    alignItems: 'center',
    fontWeight: 700,
    padding: `${theme.spacing(3)}px ${theme.spacing(0)}px`,
    width: 310,
    marginRight: theme.spacing(4),
  },
}));

export default useHighlightAnalysisLayoutStyles;
