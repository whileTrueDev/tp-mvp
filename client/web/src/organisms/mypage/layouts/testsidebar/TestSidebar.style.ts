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
  },
  accordianHeader: {
    '&:hover': {
      backgroundColor: theme.palette.primary.light
      // 마우스 가져갈때
    },

    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
  },
  active: {
    background: theme.palette.primary.main,
  },
}));

export default useTestStyle;
