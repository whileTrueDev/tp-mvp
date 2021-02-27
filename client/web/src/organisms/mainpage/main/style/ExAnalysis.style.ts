import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing('3%', 10),
    [theme.breakpoints.down('md')]: {
      padding: theme.spacing(10, 1),
    },
    [theme.breakpoints.down('xs')]: {
      padding: theme.spacing(5, 1),
    },
  },
  wrapper: {
    margin: 0,
    padding: 0,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  button: {
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.spacing(0.75, 0.75, 0, 0),
    zIndex: 100,
    width: 160,
    height: 50,
    fontSize: 20,
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.primary.main,
    boxShadow: `0px -1px 0px 0.5px ${theme.palette.divider}`,
  },
  notSelectedButton: {
    backgroundColor: theme.palette.grey[200],
    borderRadius: theme.spacing(0.75, 0.75, 0, 0),
    width: 160,
    height: 40,
    fontWeight: theme.typography.fontWeightBold,
    fontSize: 20,
    color: theme.palette.grey[500],
    boxShadow: `0px -1px 0px 0.5px ${theme.palette.divider}`,
  },
  analysisWrap: {
    width: '100%',
    borderRadius: theme.spacing(0, 1, 1, 1),
    backgroundColor: theme.palette.common.white,
    boxShadow: `0px 1px 0px 0.5px ${theme.palette.divider}`,
    [theme.breakpoints.down('sm')]: {
      borderRadius: theme.spacing(1, 1, 1, 1),
      backgroundColor: theme.palette.grey[200],
    },
  },
  downAnalysisWrap: {
    wordBreak: 'keep-all',
    height: 300,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
}));

export default styles;
