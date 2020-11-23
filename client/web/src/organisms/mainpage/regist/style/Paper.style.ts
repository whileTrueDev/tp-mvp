import makeStyles from '@material-ui/core/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
  },
  checked: {},
  checkboxRoot: {
    color: theme.palette.success.main,
    '&$checked': {
      color: theme.palette.success.light,
    },
  },
  divider: { width: 2, height: 28, margin: 10 },
  container: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 13,
  },
  inDialogContent: {
    outline: 'none',
    [theme.breakpoints.up('sm')]: {
      padding: theme.spacing(2),
    },
  },
  names: {
    [theme.breakpoints.down('xs')]: {
      fontSize: '12px',
      fontWeight: 500,
    },
    [theme.breakpoints.up('sm')]: {
      fontSize: '12px',
      fontWeight: 700,
    },
  },
  end: {
    fontSize: '12px',
  },
  buttonStyle: {
    flex: 1,
    backgroundColor: '#d6d6d6',
    height: '70%',
    fontSize: 13,
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  box: {
    padding: `${theme.spacing(2)}px ${theme.spacing(4)}px`,
    minWidth: 500,
    maxWidth: 1000,
    border: `1px solid ${theme.palette.divider}`,
  },
  content: { width: '100%', marginTop: theme.spacing(4) },
  fullButton: {
    padding: theme.spacing(2), marginTop: theme.spacing(2), width: '100%',
  },
}));

export default useStyles;
