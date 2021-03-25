import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme: Theme) => {
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
      background: `linear-gradient(${startColor}, ${endColor})`,
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      MozBackgroundClip: 'text',
      MozTextFillColor: 'transparent',
    };
  });

  return createStyles({
    barChartSection: {
      position: 'relative',
      '& .fa-star': {
        position: 'absolute',
        top: `-${theme.spacing(4)}px`,
        left: '50%',
        transform: 'translateX(-50%)',
        color: 'red',
      },
      '& .star-1': starStyles[0],
      '& .star-2': starStyles[1],
      '& .star-3': starStyles[2],
    },
    header: {
      padding: theme.spacing(2),
    },
    wrapper:{
      display: 'flex',
      borderBottom: `${1}px solid ${theme.palette.divider}`
    },
    icon: {
      display: 'flex',
      justifyContent:'center',
      alignItems:'center',
      marginRight: theme.spacing(1),
      '& .MuiSvgIcon-root':{
        fontSize: theme.typography.h4.fontSize
      }
    },
    title: {
      fontSize: theme.typography.h6.fontSize,
      fontWeight: theme.typography.fontWeightBold
    },
  });
});
