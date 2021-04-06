import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export const useCreatorInfoCardStyles = makeStyles((theme: Theme) => createStyles({
  creatorInfoContainer: {
    padding: theme.spacing(4),
  },
  creatorScoresContainer: {
    flex: 1,
  },
  avatarContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    border: `${theme.spacing(0.5)}px solid ${theme.palette.text.primary}`,
    width: '80%',
    height: 'auto',
  },
  textContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center',
    '& .nickname': {
      fontSize: theme.typography.h4.fontSize,
      fontWeight: theme.typography.fontWeightBold,
      marginRight: theme.spacing(2),
    },
    '& .chip': {
      fontSize: theme.typography.body1.fontSize,
      padding: theme.spacing(2),
    },
  },
  averageRatingText: {
    fontSize: theme.typography.h6.fontSize,
  },
}));
