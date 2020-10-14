import { makeStyles, Theme } from '@material-ui/core/styles';

const useNavbarStyles = makeStyles((theme: Theme) => ({
  appBar: {
    height: '100%',
    padding: 0,
    margin: 0,
    boxShadow: 'none',
    position: 'relative',
    display: 'block',
    zIndex: 1200,
    backgroundColor: theme.palette.primary.dark,
  },
  container: {
    paddingRight: '0px',
    paddingLeft: '0px',
    marginRight: 'auto',
    marginLeft: 'auto',
    height: '100%',
  },
  title: {
    textTransform: 'none',
    fontWeight: 'bold',
    lineHeight: '100%',
    textDecoration: 'underline',
  },
  leftGridIcon: {
    fontSize: '32px',
    marginTop: theme.spacing(1),
  },
  rightGridIcon: {
    fontSize: '32px',
  },
  useNameButton: {
    padding: 0,
    height: '100%',
    marginLeft: theme.spacing(8),
    marginRight: theme.spacing(2),
  },
  subscribePeriod: {
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'underline',
    color: theme.palette.common.white,
  },
  subscribeChip: {
    background: theme.palette.common.white,
    color: theme.palette.primary.main,
    padding: theme.spacing(1),
    marginLeft: theme.spacing(1),
    fontWeight: 'bold',
  },
  notSubscribeChip: {
    background: theme.palette.common.black,
    color: theme.palette.common.white,
    padding: theme.spacing(1),
    marginLeft: theme.spacing(1),
    fontWeight: 'bold',
  },
}));

export default useNavbarStyles;
