import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { MAX_WIDTH_DESKTOP } from '../../../../assets/constants';

export const useStyles = makeStyles((theme: Theme) => createStyles({
  container: {
    maxWidth: MAX_WIDTH_DESKTOP,
    padding: theme.spacing(0, 0, 3, 0),
  },
}));

export const useSearchTableStyle = makeStyles((theme: Theme) => {
  const smallLogoSize = theme.spacing(3);
  return createStyles({
    info: {
      display: 'flex',
      alignItems: 'center',
    },
    platformLogo: {
      width: theme.spacing(4),
      height: theme.spacing(4),
      marginRight: theme.spacing(0.5),
      [theme.breakpoints.down('sm')]: {
        width: smallLogoSize,
        height: smallLogoSize,
      },
    },
    avatar: {
      marginRight: theme.spacing(1),
      [theme.breakpoints.down('sm')]: {
        width: smallLogoSize,
        height: smallLogoSize,
      },
    },
    creatorName: {
      fontSize: theme.typography.body1.fontSize,
      [theme.breakpoints.down('sm')]: {
        fontSize: theme.spacing(1.5),
      },
    },
    categoryChip: {
      '&:not(:last-child)': {
        marginBottom: theme.spacing(0.25),
      },
    },
    border: {
      backgroundColor: theme.palette.background.paper,
      [theme.breakpoints.down('sm')]: { padding: theme.spacing(1) },
    },
    searchWrapper: {
      padding: theme.spacing(1),
    },
  });
});
