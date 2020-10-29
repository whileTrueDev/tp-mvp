import { Theme, makeStyles } from '@material-ui/core/styles';

const useSidebarStyle = makeStyles((theme: Theme) => ({
  conatiner: {
    borderTop: `1px solid ${theme.palette.divider}`,
    padding: 0,
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
  notSelectedSubRouteIcon: {
    color: theme.palette.text.disabled,
  },
  selectedSubRouteIcon: {
    color: theme.palette.text.primary,
  },
}));

export default useSidebarStyle;
