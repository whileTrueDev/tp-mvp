import { makeStyles } from '@material-ui/core';

export const sectionHeight = 320;

const useRecentStreamStyles = makeStyles((theme) => ({
  section: {
    backgroundColor: theme.palette.background.paper,
    height: sectionHeight,
    position: 'relative',
    borderTop: `${theme.spacing(1)}px solid ${theme.palette.common.black}`,
    borderBottom: `${theme.spacing(1)}px solid ${theme.palette.common.black}`,
    borderRadius: theme.spacing(0.5),
    marginBottom: theme.spacing(5),
    overflow: 'hidden',
  },
  itembox: {
    height: sectionHeight,
    display: 'flex',
    justifyContent: 'space-around',
    padding: theme.spacing(2),
    flexDirection: 'column',
    [theme.breakpoints.down('sm')]: {
      marginLeft: theme.spacing(1),
    },
  },
  leftDecorator: {
    position: 'absolute',
    left: -200,
    top: 0,
    height: sectionHeight,
  },
  title: {
    textOverflow: 'clip',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    fontWeight: 'bold',
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
  profileImage: {
    position: 'absolute',
    right: 0,
    top: 0,
    height: sectionHeight,
  },
  tooltip: {
    maxWidtH: 600,
  },
}));

export default useRecentStreamStyles;
