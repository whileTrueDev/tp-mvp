import {
  createStyles, makeStyles, Theme,
} from '@material-ui/core/styles';
import getPlatformColor from '../../../../utils/getPlatformColor';

export const useStyles = makeStyles((theme: Theme) => createStyles({
  polarAreaContainer: {
    position: 'relative',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
  },
  totalCount: {
    position: 'absolute',
    width: '100%',
    top: '50%',
    zIndex: 10,
    textAlign: 'center',
    '& img': {
      width: '100%',
      maxWidth: `${theme.spacing(10)}px`,
    },
    '&>*': {
      position: 'absolute',
      transform: 'translateY(-50%)',
    },
    '& .platformName': {
      fontSize: theme.typography.h6.fontSize,
      fontWeight: theme.typography.fontWeightBold,
    },
    '& .percent': {
      fontSize: theme.typography.h6.fontSize,
    },

  },
  afreecaCount: {
    transform: 'translate(-50%, -50%)',
    '& .platformName': {
      color: getPlatformColor('afreeca'),
    },
  },
  twitchCount: {
    '& .platformName': {
      color: getPlatformColor('twitch'),
    },
  },
}));
