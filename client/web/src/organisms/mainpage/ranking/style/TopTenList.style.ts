import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { twitchItemBackgroundColor, afreecaItemBackgroundColor } from '../../../../assets/constants';
// TopTenList 스타일
export const useTopTenList = makeStyles((theme: Theme) => createStyles({
  topTenListWrapper: {
    position: 'relative',
    paddingTop: theme.spacing(2),
    paddingLeft: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      padding: theme.spacing(0.5),
    },
  },
  header: {
    display: 'flex',
  },
  headerColumn: {
    color: theme.palette.text.secondary,
    whiteSpace: 'nowrap',
  },
  informationText: {
    padding: theme.spacing(4),
    textAlign: 'center',
  },
  listItems: {
    padding: theme.spacing(2, 0),
    [theme.breakpoints.down('sm')]: {
      padding: 0,
    },
  },
  listItem: {
    display: 'flex',
    height: theme.spacing(9.5),
    marginBottom: theme.spacing(1),
  },
  platformLogo: {
    width: theme.spacing(2.75),
    height: theme.spacing(2.75),
    '&.afreeca': {
      // maxWidth: theme.spacing(4),
      // maxHeight: theme.spacing(4),
    },
    '&.twitch': {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
  },
  background: {
    display: 'flex',
    borderRadius: theme.spacing(2),
    '&.twitch': {
      backgroundColor: twitchItemBackgroundColor,
    },
    '&.afreeca': {
      backgroundColor: afreecaItemBackgroundColor,
    },
  },
  star: {
    marginBottom: (-1) * theme.spacing(1),
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderContainer: {
    flexDirection: 'column',
    position: 'relative',
    '& p': {
      color: theme.palette.common.black,
    },
  },
  avatarContainer: {},
  avatarImage: {
    border: `${theme.spacing(0.5)}px solid ${theme.palette.text.primary}`,
    width: theme.spacing(8.75),
    height: theme.spacing(8.75),
    [theme.breakpoints.down('sm')]: {
      width: theme.spacing(6),
      height: theme.spacing(6),
    },
  },
  infoContainer: {
    padding: theme.spacing(1),
  },
  infoWrapper: {
    width: '100%',
    '&>*:not(:last-child)': {
      // marginBottom: theme.spacing(1),
    },
  },
  title: {
    color: theme.palette.grey[700],
    fontSize: theme.typography.body2.fontSize,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  infoHeader: {
    display: 'flex',
    alignItems: 'center',
  },
  nameLink: {
    width: '40%',
  },
  creatorName: {
    color: theme.palette.common.black,
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.body1.fontSize,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  ratingContainer: {
    color: theme.palette.common.black,
    '& .MuiRating-iconEmpty': {
      color: theme.palette.grey[500],
    },
    display: 'flex',
    '&.column': {
      flexDirection: 'column',
    },
    alignItems: 'center',
    '&>*': {
      fontWeight: theme.typography.fontWeightMedium,
    },
    '& .scoreText': {
      fontSize: theme.spacing(1.5),
    },
  },
  chip: {
    backgroundColor: theme.palette.grey[200],
    boxShadow: theme.shadows[2],
    color: theme.palette.common.black,
  },
  platformLogoImage: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
  trendsBarContainer: {
    marginLeft: theme.spacing(1),
    alignItems: 'flex-end',
  },
  placeholder: {
    '&>*': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  },
  scrollTopButton: {
    position: 'absolute',
    padding: 0,
    bottom: 0,
    left: 0,
  },
  scoreText: {
    position: 'relative',
    textAlign: 'right',
    fontSize: theme.spacing(1.75),
    fontWeight: theme.typography.fontWeightBold,
    color: '#c6443e', // opgg 

  },
}));

// TopTenList 내 LinearProgress 컴포넌트에 적용되는 스타일
export const useProgressBar = makeStyles((theme: Theme) => {
  const baseBorderRadius = theme.spacing(1);
  const barCommonStyle = {
    borderTopRightRadius: baseBorderRadius,
    borderBottomRightRadius: baseBorderRadius,
    boxShadow: theme.shadows[2],
  };
  const barColor = '#f2c751';

  return createStyles({
    root: {
      height: theme.spacing(1.5),
      ...barCommonStyle,
    },
    colorPrimary: {
      backgroundColor: theme.palette.grey[200],
    },
    bar: {
      ...barCommonStyle,
    },
    barColorPrimary: {
      backgroundColor: barColor,
    },
  });
});
