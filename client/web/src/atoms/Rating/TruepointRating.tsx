import Rating from '@material-ui/lab/Rating';
import withStyles from '@material-ui/core/styles/withStyles';

const TruepointRating = withStyles((theme) => ({
  icon: { color: theme.palette.common.white },
  iconFilled: { color: theme.palette.secondary.main },
  iconHover: { color: theme.palette.secondary.light },
}))(Rating);

export default TruepointRating;
