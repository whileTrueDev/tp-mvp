import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export const useMyRatingsCreatorBoxStyles = makeStyles((theme: Theme) => {
  const borderWidth = theme.spacing(1);
  return createStyles({
    box: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      position: 'relative',
      padding: theme.spacing(2.5, 4),
      backgroundColor: theme.palette.background.paper,
      border: `4px solid ${theme.palette.grey[200]}`,
      borderTopWidth: borderWidth,
      '&::after': {
        content: '" "',
        position: 'absolute',
        backgroundColor: theme.palette.primary.main,
        height: borderWidth,
        left: borderWidth * (-0.5),
        right: borderWidth * (-0.5),
        top: borderWidth * (-1),

      },
      [theme.breakpoints.down('sm')]: {
        padding: theme.spacing(1),
      },
    },
    button: {
      position: 'absolute',
      top: '50%',
      zIndex: 10,
      cursor: 'pointer',
      padding: 0,
      '&.Mui-disabled': {
        display: 'none',
      },
      '& img': {
        width: theme.spacing(7),
        height: theme.spacing(7),
        [theme.breakpoints.down('sm')]: {
          width: theme.spacing(3),
          height: theme.spacing(3),
        },
      },
      '&.prev': {
        left: -20,
      },
      '&.next': {
        right: -20,
        transform: 'rotate(180deg)',
      },
    },
    linkAvatar: {
      padding: theme.spacing(1.5),
      marginBottom: theme.spacing(3),
      color: theme.palette.text.primary,
    },
    mobileLinkAvatar: {
      width: '100%',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: theme.shadows[1],
      borderRadius: theme.shape.borderRadius,
      marginBottom: theme.spacing(0.5),
      padding: theme.spacing(0.5),
    },
  });
});
