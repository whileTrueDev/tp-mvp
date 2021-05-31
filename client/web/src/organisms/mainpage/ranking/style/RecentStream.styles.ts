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
  row: {
    color: theme.palette.text.secondary,
    transition: theme.transitions.create(
      'color', { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.short },
    ),
    '&:hover': {
      cursor: 'pointer',
      color: theme.palette.text.primary,
    },
    '&>*': {
      marginRight: theme.spacing(1),
    },
    [theme.breakpoints.down('sm')]: {
      backgroundColor: theme.palette.divider,
      marginBottom: theme.spacing(0.25),
      padding: theme.spacing(0.5, 1),
      '&>*': {
        marginRight: 0,
      },
    },
  },
  titleText: {
    textOverflow: 'clip',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    fontWeight: 'bold',
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.spacing(1.5),
    },
  },
  subText: {
    color: theme.palette.text.secondary,
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.spacing(1.25),
    },
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
