import { Theme, makeStyles } from '@material-ui/core/styles';

const useLayoutStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    width: 1520,
    margin: '0 auto',
    height: 1094,
    display: 'flex',
    backgroundColor: theme.palette.background.default,
    boxShadow: theme.shadows[4]
  },
  sidebarWrapper: {
    width: 230,
    paddingTop: 96,
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
  },
  appbarWrapper: {
    height: 96,
    position: 'sticky',
    top: 0,
  },
  mainPanel: {
    width: '100%',
    overflow: 'auto',
    backgroundColor: theme.palette.background.default,
  },
  content: {
    margin: theme.spacing(2),
    marginLeft: theme.spacing(4),
    padding: theme.spacing(4),
  },
}));

export default useLayoutStyles;
