import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { MAX_WIDTH_DESKTOP } from '../../../../assets/constants';

export const useMostSearchedCreatorListStyle = makeStyles((theme: Theme) => createStyles({
  listItem: {
    justifyContent: 'space-around',
    '& .order': { width: theme.spacing(4) },
    '& .logos': { width: 60, display: 'flex' },
    '& .logo': { width: 20, height: 20 },
    '& .platform.logo': { marginRight: 4 },
    '& .nickname': { width: 90 },
    '& .searchCount': { width: 90, color: theme.palette.text.secondary },
  },
}));

export const useStyles = makeStyles((theme: Theme) => createStyles({
  background: {
    backgroundColor: theme.palette.background.paper,
  },
  container: {
    maxWidth: MAX_WIDTH_DESKTOP,
    padding: theme.spacing(1),
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
      border: `1px solid ${theme.palette.divider}`,
      [theme.breakpoints.down('sm')]: { padding: theme.spacing(1) },
    },
    searchWrapper: {
      padding: theme.spacing(1),
    },
  });
});
