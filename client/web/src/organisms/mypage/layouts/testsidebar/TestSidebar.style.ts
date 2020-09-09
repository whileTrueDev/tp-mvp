import { Theme, makeStyles } from '@material-ui/core/styles';

const useTestStyle = makeStyles((theme: Theme) => ({
  root: {
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0',
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
    color: 'black'
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
    backgroundColor: 'parent',
    justifyContent: 'center',
    height: '74px',
    alignItems: 'center',
    alignContent: 'center',
    border: '0',
    paddingTop: '23px',
    paddingBottom: '23px',
    '&:hover': {
      backgroundColor: theme.palette.primary.light // 마우스 가져갈때
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
    color: 'black'
  },
  notSelectedTab: {
    color: '#868e96',
  },
  selectedIcon: {
    color: 'black',
    fontSize: '32px',
    justifyContent: 'center',
    textAlign: 'center'
  },
  notSelectedIcon: {
    color: 'primary',
    fontSize: '32px',
  }
}));

export default useTestStyle;
