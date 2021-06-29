import { makeStyles } from '@material-ui/core';

export const sectionHeight = 320;
const itemBoxHeight = 260;

const useRecentStreamStyles = makeStyles((theme) => {
  const bgColor = theme.palette.type === 'light'
    ? theme.palette.grey[200]
    : theme.palette.background.default;
  return ({
    section: {
      backgroundColor: theme.palette.background.paper,
      height: sectionHeight,
      position: 'relative',
      borderRadius: theme.spacing(0.5),
      overflow: 'hidden',
    },
    streamListSection: {
      height: sectionHeight,
      width: '42%',
      position: 'absolute',
      right: theme.spacing(2),
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    itembox: {
      height: itemBoxHeight,
      backgroundColor: bgColor,
      overflowY: 'auto',
      [theme.breakpoints.down('sm')]: {
        height: 'auto',
        backgroundColor: 'transparent',
      },
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
      padding: theme.spacing(1, 2),
      color: theme.palette.text.secondary,
      transition: theme.transitions.create(
        'color', { easing: theme.transitions.easing.sharp, duration: theme.transitions.duration.short },
      ),
      '&:hover': {
        cursor: 'pointer',
        backgroundColor: theme.palette.divider,
      },
      [theme.breakpoints.down('sm')]: {
        backgroundColor: bgColor,
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
      [theme.breakpoints.down('xs')]: {
        fontSize: theme.spacing(1.5),
      },
      [theme.breakpoints.down('sm')]: {
        fontSize: theme.spacing(1.75),
      },
    },
    subText: {
      color: theme.palette.text.secondary,
      fontSize: theme.spacing(1.75),
      [theme.breakpoints.down('xs')]: {
        fontSize: theme.spacing(1.25),
      },
      [theme.breakpoints.down('sm')]: {
        fontSize: theme.spacing(1.5),
      },
    },
    profileImage: {
      position: 'absolute',
      left: 0,
      top: 0,
      height: sectionHeight,
    },
    tooltip: {
      maxWidtH: 600,
    },
  });
});

export default useRecentStreamStyles;
