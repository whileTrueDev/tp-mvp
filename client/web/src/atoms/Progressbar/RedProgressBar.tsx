import withStyles from '@material-ui/core/styles/withStyles';
import LinearProgress from '@material-ui/core/LinearProgress';

const RedBorderLinearProgress = withStyles((theme) => ({
  root: { height: 5, borderRadius: 5, },
  colorPrimary: {
    backgroundColor: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
  },
  bar: {
    borderRadius: 5,
    backgroundColor: theme.palette.error.light,
  },
}))(LinearProgress);

export default RedBorderLinearProgress;
