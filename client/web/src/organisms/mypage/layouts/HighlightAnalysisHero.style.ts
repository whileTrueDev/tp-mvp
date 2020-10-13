import { makeStyles } from '@material-ui/core';

const useHighlightAnalysisHeroStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.grey[400],
  },
  leftCard: {
    padding: 24,
    backgroundColor: theme.palette.primary.light,
  },
  middleCard: {
    padding: 24,
    backgroundColor: theme.palette.primary.dark,
  },
  rightCard: {
    padding: 24,
    backgroundColor: theme.palette.secondary.light,
  },
  fonts: {
    fontWeight: 'bold',
    color: theme.palette.common.white,
  },
  image: {
    marginTop: theme.spacing(1),
    margin: theme.spacing(1),
  },
}));

export default useHighlightAnalysisHeroStyles;
