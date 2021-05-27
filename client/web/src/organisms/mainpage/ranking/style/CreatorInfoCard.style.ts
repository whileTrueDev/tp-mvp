import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export const useProfileSectionStyles = makeStyles((theme: Theme) => ({
  avatarContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      alignSelf: 'flex-start',
    },
  },
  avatar: {
    border: `${theme.spacing(0.5)}px solid ${theme.palette.text.primary}`,
    width: theme.spacing(19),
    height: theme.spacing(19),
    [theme.breakpoints.down('sm')]: {
      width: theme.spacing(9),
      height: theme.spacing(9),
    },
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
    textOverflow: 'ellipsis',
    marginRight: theme.spacing(2),
  },
  nickname: {
    fontSize: theme.typography.h5.fontSize,
    fontWeight: theme.typography.fontWeightBold,
    wordBreak: 'break-word',
  },
  ratingContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  averageRatingText: {
    fontSize: theme.typography.h6.fontSize,
  },
  creatorDescription: {
    fontSize: theme.typography.body2.fontSize,
    width: '100%',
    whiteSpace: 'pre-wrap',
  },
  linkButtons: {
    position: 'absolute',
    right: 0,
    top: theme.spacing(0.5),
  },
  chipLink: {
    margin: theme.spacing(0, 1),
    fontSize: theme.spacing(0.75),
  },
}
));

export const useScoreSectionStyles = makeStyles((theme: Theme) => ({
  scoreItemContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  scoreLabelContainer: {
    width: '35%',
    height: theme.spacing(6),
    marginRight: theme.spacing(1),
    paddingLeft: '5%',
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.spacing(1),
    display: 'flex',
    alignItems: 'center',
    '&>:nth-child(1)': {
      marginRight: theme.spacing(1),
    },
  },
  scoreLabelText: {
    fontSize: theme.typography.body2.fontSize,
  },
  scoreBarContainer: {
    flex: 1,
  },
}
));

export const useCreatorInfoCardStyles = makeStyles((theme: Theme) => {
  const commonBorderStyle = `${theme.spacing(0.5)}px solid ${theme.palette.common.black}`;
  return createStyles({
    creatorInfoContainer: {
    },
    left: {
      position: 'relative',
      padding: theme.spacing(2),
      border: commonBorderStyle,
      background: 'url("/images/rankingPage/streamer_detail_bg_1.svg") no-repeat 100% 100%',
      backgroundSize: 'contain',
      [theme.breakpoints.down('sm')]: {
        border: `1px solid ${theme.palette.divider}`,
        padding: theme.spacing(1),
      },
    },
    right: {
      border: commonBorderStyle,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      [theme.breakpoints.down('sm')]: {
        border: 'none',
      },
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
