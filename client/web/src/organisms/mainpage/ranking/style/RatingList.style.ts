import {
  makeStyles, createStyles, Theme,
} from '@material-ui/core/styles';
import yellow from '@material-ui/core/colors/yellow';
import { lighten } from '@material-ui/core/styles/colorManipulator';

// listItem 컴포넌트
export const useRatingsListItemStyles = makeStyles((theme: Theme) => {
  const contrastColor = theme.palette.text.primary;
  const defaultArrowSize = theme.spacing(0.5);
  const downArrowColor = 'blue';
  const upArrowColor = 'red';

  return createStyles({
    listItem: {
      color: contrastColor,
      position: 'relative',
      marginBottom: theme.spacing(1),
      padding: 0,

    },
    bg: {
      padding: theme.spacing(1, 0),
      width: '100%',
    },
    [`listItem-${1}`]: {
      '& $bg': {
        backgroundColor: theme.palette.type === 'light' && lighten(theme.palette.primary.main, 0.1),
      },
    },
    [`listItem-${2}`]: {
      '& $bg': {
        backgroundColor: theme.palette.type === 'light' && lighten(theme.palette.primary.main, 0.3),
      },
    },
    [`listItem-${3}`]: {

      '& $bg': {
        backgroundColor: theme.palette.type === 'light' && lighten(theme.palette.primary.main, 0.5),
      },
    },
    [`listItem-${4}`]: {
      '& $bg': {
        backgroundColor: theme.palette.type === 'light' && lighten(theme.palette.primary.main, 0.7),
      },
    },
    frame: {
      position: 'absolute',
      left: 0,
      width: '100%',
      height: '100%',
      paddingTop: theme.spacing(3),
      marginBottom: theme.spacing(1),
      backgroundImage: 'url(images/rankingPage/rankingBox-normal.png)',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'contain',
    },
    contentBackground: {
      position: 'absolute',
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(3.5, 1, 2.5, 1.5),
      backgroundClip: 'content-box',
    },
    contentBox: {
      // zIndex: 1,
      // marginTop: theme.spacing(2),
    },
    platformLogo: {
      width: '100%',
      height: 'auto',
      marginTop: theme.spacing(-1),
      '&.afreeca': {
        maxWidth: theme.spacing(3),
        maxHeight: theme.spacing(3),
      },
      '&.twitch': {
        maxWidth: theme.spacing(5),
        maxHeight: theme.spacing(5),
      },
    },
    linkContainer: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
    },
    avatarImage: {
      marginRight: theme.spacing(0.5),
      border: `${theme.spacing(0.5)}px solid ${theme.palette.text.primary}`,
      width: theme.spacing(6.5),
      height: theme.spacing(6.5),
    },
    creatorName: {
      marginRight: theme.spacing(1),
      fontSize: theme.typography.body2.fontSize,
      fontWeight: theme.typography.fontWeightBold,
      color: theme.palette.text.primary,
      wordBreak: 'keep-all',
    },
    black: { color: contrastColor },
    ratingText: {
      textAlign: 'center',
      fontSize: theme.typography.caption.fontSize,
    },
    orderText: {
      color: theme.palette.text.primary,
      fontWeight: theme.typography.fontWeightBold,
      fontSize: theme.typography.h6.fontSize,
    },
    rating: {
      '& .MuiRating-iconFilled': {
        color: yellow[400],
      },
    },
    rankChange: {
      position: 'relative',
      paddingLeft: theme.spacing(1.5),
      fontSize: theme.spacing(1.25),
      '&::before': {
        content: '""',
        position: 'absolute',
        left: 0,
        top: '40%',
      },
      '&.down': {
        '&::before': {
          borderTop: `${defaultArrowSize}px solid ${downArrowColor}`,
          borderLeft: `${defaultArrowSize}px solid transparent`,
          borderRight: `${defaultArrowSize}px solid transparent`,
        },
      },
      '&.up': {
        '&::before': {
          borderBottom: `${defaultArrowSize}px solid ${upArrowColor}`,
          borderLeft: `${defaultArrowSize}px solid transparent`,
          borderRight: `${defaultArrowSize}px solid transparent`,
        },
      },
      '&.remain': {
        '&::before': {
          width: theme.spacing(1),
          height: theme.spacing(0.5),
          backgroundColor: theme.palette.grey[400],
        },
      },
    },
  });
});

// list 컴포넌트
export const useRatingsListStyles = makeStyles((theme: Theme) => {
  const textStrokeColor = theme.palette.common.white;
  return createStyles({
    ratingsListSection: {
      borderRadius: theme.spacing(0.5),
      backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.background.paper,
      padding: theme.spacing(1, 0),
      [theme.breakpoints.down('sm')]: {
        backgroundColor: theme.palette.background.paper,
      },
    },
    title: {
      textAlign: 'center',
      padding: theme.spacing(1, 0, 0, 1),
      fontSize: theme.typography.h5.fontSize,
      fontWeight: theme.typography.fontWeightBold,
      color: theme.palette.primary.main,
      textShadow: `-1px -1px 0 ${textStrokeColor}, 1px -1px 0 ${textStrokeColor}, -1px 1px 0 ${textStrokeColor}, 1px 1px 0 ${textStrokeColor}`,
    },
    subTitle: {
      height: theme.spacing(4),
      textAlign: 'center',
      fontSize: theme.typography.caption.fontSize,
    },
    listItemContainer: {
      padding: theme.spacing(1),
    },
    text: {
      padding: theme.spacing(2),
    },
    headerText: {
      textAlign: 'center',
      fontWeight: theme.typography.fontWeightBold,
      fontSize: theme.typography.body2.fontSize,
      color: theme.palette.text.primary,
    },
  });
});
