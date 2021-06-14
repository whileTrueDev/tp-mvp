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
    marginBottom: theme.spacing(0.5),
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 13,
    border: `1px solid ${theme.palette.divider}`,
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
    backgroundColor: theme.palette.grey.A100,
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
    minWidth: 320,
    maxWidth: 1000,
  },
  content: { width: '100%' },

  fullButton: {
    padding: theme.spacing(2), marginTop: theme.spacing(2), width: '100%',
  },
  backButton: {
    backgroundColor: theme.palette.grey.A100,
  },
}));

export default useStyles;
