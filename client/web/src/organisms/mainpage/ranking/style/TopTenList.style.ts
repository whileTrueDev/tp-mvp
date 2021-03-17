import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import yellow from '@material-ui/core/colors/yellow';
import orange from '@material-ui/core/colors/orange';

// TopTenList 스타일
export const useTopTenList = makeStyles((theme: Theme) => createStyles({
  wrapper: {
    paddingTop: theme.spacing(2),
  },
  header: {
    display: 'flex',
  },
  headerColumn: {
    color: theme.palette.grey[600],
  },
  listItems: {},
  listItem: {
    display: 'flex',
    height: theme.spacing(19),
    '&:nth-child(1) $star': {
      color: yellow[500],
    },
    '&:nth-child(2) $star': {
      color: theme.palette.grey[300],
    },
    '&:nth-child(3) $star': {
      color: orange[500],
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
    '& p': {
      fontSize: theme.typography.h5.fontSize,
    },
  },
  avatarContainer: {},
  avatarImage: {
    border: `${theme.spacing(0.5)}px solid ${theme.palette.text.primary}`,
    width: theme.spacing(10),
    height: theme.spacing(10),
  },
  infoContainer: {
    padding: theme.spacing(1),
  },
  infoWrapper: {
    width: '100%',
    '&>*:not(:last-child)': {
      marginBottom: theme.spacing(1),
    },
  },
  title: {
    color: theme.palette.grey[700],
    fontSize: theme.typography.body2.fontSize,
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
  },
  nameContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  creatorName: {
    fontWeight: theme.typography.fontWeightBold,
    fontSize: theme.typography.h6.fontSize,
  },
  chip: {
    backgroundColor: theme.palette.grey[200],
    boxShadow: theme.shadows[2],
  },
  platformLogoImage: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
  scoreText: {
    position: 'relative',
    textAlign: 'right',
    fontWeight: theme.typography.fontWeightBold,
    color: theme.palette.primary.dark,
  },
  trendsBarContainer: {
    padding: theme.spacing(1),
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

  return createStyles({
    root: {
      height: theme.spacing(2),
      ...barCommonStyle,
    },
    colorPrimary: {
      backgroundColor: theme.palette.grey[200],
    },
    bar: {
      ...barCommonStyle,
    },
    barColorPrimary: {
      backgroundColor: theme.palette.primary.main,
    },
  });
});
