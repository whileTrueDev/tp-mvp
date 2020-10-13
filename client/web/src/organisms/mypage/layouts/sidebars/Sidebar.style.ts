import { Theme, makeStyles } from '@material-ui/core/styles';

const drawerWidth = 206;
const useSiedebarStyles = makeStyles((theme: Theme) => ({
  flex: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0',
  },
  drawerPaper: {
    border: 'none',
    position: 'static',
    top: '0',
    bottom: '0',
    left: '0',
    zIndex: 1,
    width: drawerWidth,
    // [theme.breakpoints.up('md')]: {
    //   width: drawerWidth,
    //   position: 'fixed',
    //   height: '100%',
    // },
    // [theme.breakpoints.down('sm')]: {
    //   width: '80px',
    //   position: 'fixed',
    //   display: 'block',
    //   top: '0',
    //   height: '100vh',
    //   right: '0',
    //   left: 'auto',
    //   zIndex: 10,
    //   visibility: 'visible',
    //   overflowY: 'visible',
    //   borderTop: 'none',
    //   textAlign: 'left',
    //   paddingRight: '0px',
    //   paddingLeft: '0',
    //   transform: `translate3d(${80}px, 0, 0)`,
    // },
  },
  desktopPaper: {
    border: 'none',
    top: '0',
    bottom: '0',
    left: '0',
    zIndex: 1,
    width: drawerWidth,
  },
  sidebarWrapper: {
    position: 'relative',
    height: 'auto',
    overflow: 'auto',
    zIndex: 4,
    overflowScrolling: 'touch',
  },
  listWrapper: {
    padding: '1px',
  },
  listText: {
    minheight: '74px',
    width: 'parent',
    textAlign: 'center',
    justifyContent: 'center',
    padding: '0px',
    fontSize: '15px',
    backgroundColor: 'parent',
  },
  listIconWrapper: {
    padding: '0',
    margin: '0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listIcon: {
    fontSize: '32px',
    color: 'black',
  },
  accordianList: {
    width: 'parent',
    padding: '5px',
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    backgroundColor: 'parent',
  },
  accordian: {
    boxShadow: 'none',
    border: '0',
    background: 'parent',
  },
  accordianHeader: {
    width: drawerWidth,
    backgroundColor: 'parent',
    justifyContent: 'center',
    height: '74px',
    alignItems: 'center',
    alignContent: 'center',
    border: '0',
    paddingTop: '23px',
    paddingBottom: '23px',
    paddingLeft: '0px',
    paddingRight: '0px',
    '&:hover': {
      backgroundColor: theme.palette.primary.light, // 마우스 가져갈때
    },
  },
  accordianHeaderButton: {
    width: '100%',
    height: '74px',
    margin: '0px',
    border: '0px',
  },
  subTabItem: {
    padding: '0',
    '&:hover,&:focus': {
      color: theme.palette.primary.light, // 클릭 했을 때
    },
  },
  selectedTab: {
    fontWeight: 'bold',
    color: 'black',
  },
  notSelectedTab: {
    color: '#868e96',
  },
  selectedIcon: {
    color: 'black',
    fontSize: '32px',

  },
  notSelectedIcon: {
    color: 'primary',
    fontSize: '32px',
  },
}));

export default useSiedebarStyles;
