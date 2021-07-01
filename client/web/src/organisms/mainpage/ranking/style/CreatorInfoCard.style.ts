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
      width: theme.spacing(10),
      height: theme.spacing(10),
    },
  },
  textContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'flex-start',
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
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.spacing(2.25),
      marginBottom: theme.spacing(0.5),
    },
  },
  ratingContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      order: 1, // 마지막 위치로
      paddingTop: theme.spacing(1),
    },
  },
  averageRatingText: {
    fontSize: theme.typography.h6.fontSize,
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.body2.fontSize,
    },
  },
  descriptionContainer: {
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(0.5),
    },
  },
  creatorDescription: {
    fontSize: theme.typography.body2.fontSize,
    width: '100%',
    whiteSpace: 'pre-wrap',
    [theme.breakpoints.down('xs')]: {
      fontSize: theme.spacing(1.25),
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.spacing(1.5),
    },
  },
  linkButtons: {
    position: 'absolute',
    right: 0,
    top: theme.spacing(0.5),
    [theme.breakpoints.down('sm')]: {
      position: 'relative',
      textAlign: 'right',
      marginBottom: theme.spacing(0.5),
    },
  },
  chipLink: {
    margin: theme.spacing(0, 1),
    fontSize: theme.spacing(0.75),
    [theme.breakpoints.down('sm')]: {
      height: theme.spacing(2),
    },
  },
}
));

export const useScoreSectionStyles = makeStyles((theme: Theme) => ({
  scoreItemContainer: {
    display: 'flex',
    alignItems: 'center',
    paddingRight: theme.spacing(1),
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
    boxShadow: '-3px -2px 4px 0 rgba(0, 0, 0, 0.07)',
    '&>:nth-child(1)': {
      marginRight: theme.spacing(1),
    },
  },
  scoreLabelText: {
    fontSize: theme.typography.body2.fontSize,
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.spacing(1.5),
    },
  },
  scoreBarContainer: {
    flex: 1,
  },
}
));

export const useCreatorInfoCardStyles = makeStyles((theme: Theme) => createStyles({
  creatorInfoContainer: {
  },
  left: {
    position: 'relative',
    padding: theme.spacing(2),
    background: 'url("/images/rankingPage/streamer_detail_bg_3.svg") no-repeat 100% 100%',
    backgroundSize: 'contain',
    [theme.breakpoints.down('sm')]: {
      border: `1px solid ${theme.palette.divider}`,
      padding: theme.spacing(1),
    },
  },
  right: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  logo: {
    marginRight: theme.spacing(1),
    width: theme.spacing(3),
    height: theme.spacing(3),
    verticalAlign: 'middle',
    [theme.breakpoints.down('sm')]: {
      width: theme.spacing(2),
      height: theme.spacing(2),
    },
  },
}));

export const useExLargeRatingStyle = makeStyles((theme: Theme) => createStyles({
  root: {
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.h4.fontSize,
    },

  },
}));
