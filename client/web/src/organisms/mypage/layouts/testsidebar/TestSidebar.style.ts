import { Theme, makeStyles } from '@material-ui/core/styles';

const useTestStyle = makeStyles((theme: Theme) => ({
  root: {
    marginTop: '64px',
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0',
  },
  listText: {
    padding: '0',
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: '15px',
    backgroundColor: 'transparent',
  },
  listIcon: {
    padding: '0',
    margin: '0',
    justifyContent: 'center',
    alignItems: 'center',

  },
  accordianList: {
    textAlign: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    backgroundColor: 'transparent',
  },
  accordian: {
    boxShadow: 'none',
    border: '0',
    // '&:focus': {
    //   backgroundColor: theme.palette.primary.light // 클릭 했을 때
    // },

  },
  testButton: {
    '&:hover': {
      backgroundColor: theme.palette.primary.light // 마우스 가져갈때
    },
    '&:visited': {
      backgroundColor: theme.palette.primary.light // 마우스 가져갈때
    },
    width: '100%',
    border: '0',
  },
  accordianHeader: {
    // '&:hover': {
    //   backgroundColor: theme.palette.primary.light // 마우스 가져갈때
    // },
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    border: '0',
    // '&: root': {
    //   '&$expanded': {
    //     backgroundColor: theme.palette.primary.light // 클릭 했을 때
    //   },
    // }
  },
  active: {
    background: theme.palette.primary.main,
  },
  subTabActive: {
    '&:focus': {
      color: theme.palette.primary.light // 클릭 했을 때
    },
  }
}));

export default useTestStyle;
