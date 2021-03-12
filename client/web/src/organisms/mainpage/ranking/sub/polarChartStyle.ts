import {
  createStyles, makeStyles, Theme,
} from '@material-ui/core/styles';
/**----------------------------------------------------------
 * 스타일 훅
 * 4.컨테이터 클래스 polarAreaContainer 아래 .highcharts-blobs { -webkit-filter: 'url(#gooey-effect)'; filter: 'url(#gooey-effect)'; } 적용
 */
export const useStyles = makeStyles((theme: Theme) => createStyles({
  polarAreaContainer: {
    position: 'relative',
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    '& .highcharts-blobs': {
      '-webkit-filter': 'url(#gooey-effect)',
      filter: 'url(#gooey-effect)', // 마스크에 svg필터 적용
    },
  },
  title: {
    position: 'absolute',
    zIndex: 10,
    transform: 'translate(10%,30%)',
  },
  totalCount: {
    position: 'absolute',
    width: '100%',
    top: '50%',
    zIndex: 10,
    '& img': {
      width: '100%',
      maxWidth: '100px',
    },
    '&>*': {
      position: 'absolute',
      transform: 'translateY(-50%)',
    },
  },
  afreecaCount: {
    right: '75%',
    transform: 'translate(-50%, -50%)',
  },
  twitchCount: {
    left: '75%',
  },
}));
