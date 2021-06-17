import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  registForm: {
    maxWidth: '470px',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '300px',
    },
  },
  row: {
    '&>*': {
      width: '100%',
    },
  },
  textField: {
    color: theme.palette.text.secondary,
    [theme.breakpoints.down('xs')]: {
      minWidth: '200px',
      marginRight: 0,
    },
    [theme.breakpoints.up('sm')]: {
      minWidth: '250px',
      marginRight: '10px',
    },
  },
  phoneField: {
    [theme.breakpoints.down('xs')]: {
      minWidth: '180px',
      marginRight: 0,
    },
    [theme.breakpoints.up('sm')]: {
      width: 180,
    },
  },
  divider: {
    width: 2,
    height: 28,
    margin: 2,
  },
  button: {
    width: '100%',
    padding: theme.spacing(2),
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    '&.back': {
      backgroundColor: theme.palette.grey.A100,
    },
  },
  adornment: {
    fontSize: '20px',
    fontWeight: 900,
  },
  switchbox: {
    marginLeft: theme.spacing(1),
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switch: {
    label: {
      fontSize: '11px',
      color: 'black',
    },
    margin: 0,
    marginTop: theme.spacing(3),
    padding: 0,
  },
  successText: {
    color: theme.palette.success.main,
  },
}));

export default useStyles;
