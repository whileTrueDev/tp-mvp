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
      background: 'url("/images/rankingPage/streamer_detail_bg_1.svg") no-repeat 100% 100%',
      backgroundSize: 'contain',
    },
    right: {
      border: commonBorderStyle,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: theme.spacing(0, 1),
    },
    scoreItemContainer: {
      display: 'flex',
      alignItems: 'center',
    },
    scoreLabelContainer: {
      width: '30%',
      marginRight: theme.spacing(1),
      padding: theme.spacing(3, 0, 3, 6),
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.spacing(1),
      display: 'flex',
      justifyContent: 'flex-start',
      '&>:nth-child(1)': {
        marginRight: theme.spacing(1),
      },
    },
    scoreLabelText: {
      fontSize: theme.typography.h6.fontSize,
    },
    scoreBarContainer: {
      flex: 1,
    },
    avatarContainer: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: theme.spacing(2),
    },
    avatar: {
      border: `${theme.spacing(0.5)}px solid ${theme.palette.text.primary}`,
      width: theme.spacing(35),
      height: theme.spacing(35),
    },
    textContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      '& .upper-text': {
        display: 'flex',
        width: '100%',
        marginBottom: theme.spacing(2),
      },
    },
    nameContainer: {
      display: 'flex',
      alignItems: 'center',
      maxWidth: '40%',
      textOverflow: 'ellipsis',
    },
    nickname: {
      fontSize: theme.typography.h4.fontSize,
      fontWeight: theme.typography.fontWeightBold,
      marginRight: theme.spacing(2),
      wordBreak: 'break-word',
    },
    ratingContainer: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
    },
    averageRatingText: {
      fontSize: theme.typography.h6.fontSize,
    },
    creatorDescription: {
      width: '100%',
      whiteSpace: 'pre-wrap',
    },
    chipLink: {
      margin: theme.spacing(0, 1),
      fontSize: theme.typography.body1.fontSize,
      padding: theme.spacing(2),
    },
    logo: {
      marginRight: theme.spacing(1),
      width: theme.spacing(3),
      height: theme.spacing(3),
      verticalAlign: 'middle',
    },
  });
});

export const useExLargeRatingStyle = makeStyles((theme: Theme) => createStyles({
  sizeLarge: {
    fontSize: theme.typography.h3.fontSize,
  },
}));
