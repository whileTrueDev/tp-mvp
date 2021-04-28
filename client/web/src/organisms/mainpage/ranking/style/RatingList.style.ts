import {
  makeStyles, createStyles, Theme,
} from '@material-ui/core/styles';
import yellow from '@material-ui/core/colors/yellow';
import { lighten } from '@material-ui/core/styles/colorManipulator';

// listItem 컴포넌트
export const useRatingsListItemStyles = makeStyles((theme: Theme) => {
  const contrastColor = theme.palette.text.primary;
  const defaultArrowSize = theme.spacing(1);
  const downArrowColor = 'blue';
  const upArrowColor = 'red';

  return createStyles({
    listItem: {
      height: theme.spacing(17),
      color: contrastColor,
      paddingRight: theme.spacing(1.5),
    },
    [`listItem-${1}`]: {
      '& $frame': {
        backgroundImage: 'url(images/rankingPage/rankingBox-1.png)',
      },
      '& $contentBackground': {
        backgroundColor: theme.palette.type === 'light' && lighten(theme.palette.primary.main, 0.1),
      },
    },
    [`listItem-${2}`]: {
      '& $frame': {
        backgroundImage: 'url(images/rankingPage/rankingBox-2.png)',
      },
      '& $contentBackground': {
        backgroundColor: theme.palette.type === 'light' && lighten(theme.palette.primary.main, 0.3),
      },
    },
    [`listItem-${3}`]: {
      '& $frame': {
        backgroundImage: 'url(images/rankingPage/rankingBox-3.png)',
      },
      '& $contentBackground': {
        backgroundColor: theme.palette.type === 'light' && lighten(theme.palette.primary.main, 0.5),
      },
    },
    [`listItem-${4}`]: {
      '& $contentBackground': {
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
    },
    contentBackground: {
      position: 'absolute',
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(3, 1.5, 1, 2),
      backgroundClip: 'content-box',
    },
    contentBox: {
      zIndex: 1,
      marginTop: theme.spacing(2),
    },
    platformLogo: {
      width: '100%',
      height: 'auto',
      '&.afreeca': {
        maxWidth: theme.spacing(4),
        maxHeight: theme.spacing(4),
      },
      '&.twitch': {
        maxWidth: theme.spacing(5),
        maxHeight: theme.spacing(5),
      },
    },
    avatarImage: {
      marginRight: theme.spacing(2),
      border: `${theme.spacing(0.5)}px solid ${theme.palette.text.primary}`,
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
    creatorName: {
      marginRight: theme.spacing(1),
      fontSize: theme.typography.h6.fontSize,
      fontWeight: theme.typography.fontWeightBold,
      color: theme.palette.text.primary,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
    },
    black: { color: contrastColor },
    ratingText: {
      textAlign: 'center',
      fontSize: theme.typography.h6.fontSize,
      fontWeight: theme.typography.fontWeightBold,
    },
    orderText: {
      color: theme.palette.text.primary,
      fontWeight: theme.typography.fontWeightBold,
      fontSize: theme.typography.h4.fontSize,
    },
    rating: {
      '& .MuiRating-iconFilled': {
        color: yellow[400],
      },
    },
    rankChange: {
      position: 'relative',
      paddingLeft: theme.spacing(3),
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
      border: `${theme.spacing(1)}px solid ${theme.palette.common.black}`,
      borderRadius: theme.spacing(0.5),
      backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[300] : theme.palette.background.paper,
      padding: theme.spacing(2, 0),
    },
    title: {
      textAlign: 'center',
      padding: theme.spacing(1, 0, 0, 1),
      fontSize: theme.typography.h3.fontSize,
      fontWeight: theme.typography.fontWeightBold,
      color: theme.palette.primary.main,
      textShadow: `-1px -1px 0 ${textStrokeColor}, 1px -1px 0 ${textStrokeColor}, -1px 1px 0 ${textStrokeColor}, 1px 1px 0 ${textStrokeColor}`,
    },
    subTitle: {
      height: theme.spacing(4),
      textAlign: 'center',
      fontSize: theme.typography.h6.fontSize,
    },
    listItemContainer: {
    },
    text: {
      padding: theme.spacing(2),
    },
    headerText: {
      textAlign: 'center',
      color: theme.palette.text.primary,
    },
  });
});
