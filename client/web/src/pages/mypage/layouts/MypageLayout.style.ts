import { Theme, makeStyles } from '@material-ui/core/styles';

const useLayoutStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    position: 'sticky',
    minHeight: 'calc(100vh - 100px)',
    background: `linear-gradient(${theme.palette.primary.main}, ${theme.palette.primary.light})`,
  },
  conatiner: {
    width: 1400,
    margin: '0 auto',
    minHeight: 1094,
    display: 'flex',
    boxShadow: theme.shadows[4],
    backgroundColor: theme.palette.background.default,
  },
  sidebarWrapper: {
    width: 230,
    paddingTop: 96,
    backgroundColor: theme.palette.background.paper,
    borderRight: `1px solid ${theme.palette.divider}`,
    top: 0,
  },
  appbarWrapper: {
    height: 96,
    top: 0,
    position: 'sticky',
    zIndex: 9999,
  },
  mainPanel: {
    width: '100%',
    overflow: 'auto',
    backgroundColor: theme.palette.background.default,
  },
}));

export default useLayoutStyles;
