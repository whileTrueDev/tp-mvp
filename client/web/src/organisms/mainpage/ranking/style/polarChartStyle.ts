import {
  createStyles, makeStyles, Theme,
} from '@material-ui/core/styles';
import { CAROUSEL_HEIGHT } from '../../../../assets/constants';
import getPlatformColor from '../../../../utils/getPlatformColor';

export const useStyles = makeStyles((theme: Theme) => createStyles({
  polarAreaContainer: {
    position: 'relative',
    backgroundColor: theme.palette.background.paper,
    height: CAROUSEL_HEIGHT,
  },
  totalCount: {
    position: 'absolute',
    width: '100%',
    top: '50%',
    zIndex: 10,
    textAlign: 'center',
    '& img': {
      width: '100%',
      maxWidth: `${theme.spacing(5)}px`,
    },
    '&>*': {
      position: 'absolute',
      transform: 'translateY(-50%)',
    },
    '& .platformName': {
      fontSize: theme.typography.body2.fontSize,
      fontWeight: theme.typography.fontWeightBold,
    },
    '& .percent': {
      fontSize: theme.typography.body1.fontSize,
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
