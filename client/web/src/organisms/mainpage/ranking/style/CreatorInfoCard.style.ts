import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export const useCreatorInfoCardStyles = makeStyles((theme: Theme) => {
  const commonBorderStyle = `${theme.spacing(0.5)}px solid ${theme.palette.common.black}`;
  return createStyles({
    creatorInfoContainer: {
    },
    left: {
      position: 'relative',
      padding: theme.spacing(4),
      border: commonBorderStyle,
    },
    right: {
      padding: theme.spacing(4),
      border: commonBorderStyle,
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
    },
    nickname: {
      fontSize: theme.typography.h4.fontSize,
      fontWeight: theme.typography.fontWeightBold,
      marginRight: theme.spacing(2),
    },
    ratingContainer: {

    },
    averageRatingText: {
      fontSize: theme.typography.h6.fontSize,
    },
    creatorDescription: {

    },
    chipLink: {
      position: 'absolute',
      right: theme.spacing(2),
      top: theme.spacing(2),
      fontSize: theme.typography.body1.fontSize,
      padding: theme.spacing(2),
    },
  });
});
