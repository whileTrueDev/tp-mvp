import {
  createStyles, makeStyles, Theme,
} from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => createStyles({
  polarAreaContainer: {
    position: 'relative',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    position: 'absolute',
    zIndex: 10,
    transform: 'translate(10%,30%)',
  },
  totalCount: {
    position: 'absolute',
    width: '100%',
    top: '50%',
    zIndex: 10,
    '& img': {
      width: '100%',
      maxWidth: '100px',
    },
    '&>*': {
      position: 'absolute',
      transform: 'translateY(-50%)',
    },
  },
  afreecaCount: {
    transform: 'translate(-50%, -50%)',
  },
  twitchCount: {
  },
}));
