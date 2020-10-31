import { Theme, makeStyles } from '@material-ui/core/styles';
import { SIDE_BAR_WIDTH } from '../../../../assets/constants';

const useTestStyle = makeStyles((theme: Theme) => ({
  conatiner: {
    padding: 0,
    width: SIDE_BAR_WIDTH - 10, // scrollbar 자리 10px
    height: '100vh',
  },
  listItem: {
    padding: 0,
    minheight: '74px',
    textAlign: 'center',
  },
  icon: { fontSize: 32 },
  notSelectedTab: { color: theme.palette.text.disabled },
  selected: { color: theme.palette.text.primary, fontWeight: 'bold' },
  selectedIndicator: {
    transform: 'rotate(-90deg)',
    fontSize: 32,
    marginTop: '3px',
    color: theme.palette.text.primary,
  },
  accordian: {
    boxShadow: 'none',
    border: '0',
    background: 'parent',
  },
  accordianHeader: {
    height: '74px',
    alignContent: 'center',
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    '&:hover': {
      backgroundColor: theme.palette.primary.light, // 마우스 가져갈때
    },
  },
  subRouteList: { display: 'block' },
  subRouteLink: {
    padding: `${theme.spacing(1)}px 0px ${theme.spacing(1)}px ${theme.spacing(2)}px`,
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    textDecoration: 'none',
  },
}));

export default useTestStyle;
