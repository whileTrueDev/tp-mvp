import { makeStyles } from '@material-ui/core';

const useRecentStreamStyles = makeStyles((theme) => ({
  section: {
    backgroundColor: theme.palette.background.paper,
    height: 600,
    position: 'relative',
    paddingTop: theme.spacing(3),
    borderTop: `${theme.spacing(1)}px solid ${theme.palette.common.black}`,
    borderBottom: `${theme.spacing(1)}px solid ${theme.palette.common.black}`,
    borderRadius: theme.spacing(0.5),
    marginBottom: theme.spacing(5),
  },
  itembox: {
    marginLeft: 200,
    marginTop: theme.spacing(5),
    [theme.breakpoints.down('sm')]: {
      marginLeft: theme.spacing(1),
    },
  },
  title: {
    textOverflow: 'clip',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    fontWeight: 'bold',
    fontSize: '2rem',
    color: theme.palette.text.secondary,
    transition: theme.transitions.create(
      'color', { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.short },
    ),
    '&:hover': {
      cursor: 'pointer',
      color: theme.palette.text.primary,
    },
  },
  subtitle: {
    marginLeft: theme.spacing(2),
    fontWeight: 'bold',
  },
  tooltip: {
    maxWidtH: 600,
  },
}));

export default useRecentStreamStyles;
