import { Theme, makeStyles } from '@material-ui/core/styles';

const useLayoutStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    minHeight: '100vh',
    background: `linear-gradient(${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  },
  conatiner: {
    width: 1520,
    margin: '0 auto',
    height: 1094,
    display: 'flex',
    boxShadow: theme.shadows[4],
    backgroundColor: theme.palette.background.default,
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
}));

export default useLayoutStyles;
