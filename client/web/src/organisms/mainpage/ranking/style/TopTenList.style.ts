import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import getPlatformColor from '../../../../utils/getPlatformColor';
import { lighten } from '@material-ui/core/styles/colorManipulator';

// TopTenList 스타일
export const useTopTenList = makeStyles((theme: Theme) => {
  // 별에 그라디언트 넣기 위한 색 설정
  const starColors = [
    { color: 'yellow', startColor: '#ffff00', endColor: '#c9a589' }, // 금
    { color: 'silver', startColor: '#ebebeb', endColor: '#7f9090' }, // 은
    { color: 'orange', startColor: '#ff8800', endColor: '#9f5c02' }, // 동
  ];
  const starStyles = starColors.map((c, i: number) => {
    const { color, startColor, endColor } = starColors[i];
    return {
      color,
      backgroundImage: `linear-gradient(${startColor}, ${endColor})`,
    };
  });

  return createStyles({
    wrapper: {
      padding: theme.spacing(2,1),
    },
    header: {
      display: 'flex',
    },
    headerColumn: {
      color: theme.palette.grey[600],
      whiteSpace: 'nowrap',
    },
    listItems: {
      paddingTop: theme.spacing(1)
    },
    listItem: {
      display: 'flex',
      height: theme.spacing(18),
      marginBottom: theme.spacing(1),
      '&:nth-child(1) .fa-star': starStyles[0],
      '&:nth-child(2) .fa-star': starStyles[1],
      '&:nth-child(3) .fa-star': starStyles[2],
      '& .fa-star': {
        fontSize: theme.typography.h6.fontSize,
        /* Set the background size and repeat properties. */
        backgroundSize: '100%',
        backgroundRepeat: 'repeat',

        /* Use the text as a mask for the background. */
        /* This will show the gradient as a text color rather than element bg. */
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        MozBackgroundClip: 'text',
        MozTextFillColor: 'transparent',
      },
    },
    background:{
      display: 'flex',
      borderRadius: theme.spacing(2),
      '&.twitch': {
        backgroundColor: lighten(getPlatformColor('twitch'),0.9)
      },
      '&.afreeca': {
        backgroundColor: lighten(getPlatformColor('afreeca'),0.9)
      }
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
      textOverflow: 'ellipsis',
      overflow: 'hidden',
      whiteSpace: 'nowrap',
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
  });
});

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
      backgroundColor: theme.palette.primary.light,
    },
  });
});
