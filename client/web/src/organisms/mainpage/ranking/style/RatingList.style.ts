import {
  makeStyles, createStyles, Theme,
} from '@material-ui/core/styles';
import yellow from '@material-ui/core/colors/yellow';
// import { lighten } from '@material-ui/core/styles/colorManipulator';

// listItem 컴포넌트
export const useRatingsListItemStyles = makeStyles((theme: Theme) => {
  const contrastColor = theme.palette.text.primary;

  return createStyles({
    listItem: {
      height: theme.spacing(17),
      color: contrastColor,
      paddingTop: theme.spacing(3),
      marginBottom: theme.spacing(1),
      backgroundImage: 'url(images/rankingPage/rankingBox-normal.png)',
      backgroundPosition: 'center center',
      backgroundRepeat: 'no-repeat',
    },
    [`listItem-${1}`]: {
      backgroundImage: 'url(images/rankingPage/rankingBox-1.png)',
    },
    [`listItem-${2}`]: {
      backgroundImage: 'url(images/rankingPage/rankingBox-2.png)',
    },
    [`listItem-${3}`]: {
      backgroundImage: 'url(images/rankingPage/rankingBox-3.png)',
    },
    [`listItem-${4}`]: {
    },
    avatarImage: {
      marginRight: theme.spacing(2),
      border: `${theme.spacing(0.5)}px solid ${theme.palette.text.primary}`,
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
    creatorName: {
      marginRight: theme.spacing(1),
      fontSize: theme.typography.body1.fontSize,
      fontWeight: theme.typography.fontWeightBold,
      color: theme.palette.text.primary,
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
    },
    black: { color: contrastColor },
    ratingText: {
      textAlign: 'center',
      fontSize: theme.typography.body1.fontSize,
    },
    orderText: {
      padding: theme.spacing(0, 1),
      backgroundColor: 'blue',
      border: `1px solid ${theme.palette.common.black}`,
      color: theme.palette.common.white,
      fontWeight: theme.typography.fontWeightBold,
    },
    rating: {
      '& .MuiRating-iconFilled': {
        color: yellow[400],
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
      backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.background.paper,
      padding: theme.spacing(2, 0),
    },
    title: {
      textAlign: 'center',
      padding: theme.spacing(1, 0, 0, 1),
      fontSize: theme.typography.h5.fontSize,
      fontWeight: theme.typography.fontWeightBold,
      color: theme.palette.primary.main,
      textShadow: `-1px -1px 0 ${textStrokeColor}, 1px -1px 0 ${textStrokeColor}, -1px 1px 0 ${textStrokeColor}, 1px 1px 0 ${textStrokeColor}`,
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
