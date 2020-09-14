import { makeStyles } from '@material-ui/core';

const useHighlightAnalysisHeroStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.grey[400]
  },
  leftCard: {
    padding: 20,
    backgroundColor: theme.palette.primary.light,
  },
  middleCard: {
    padding: 20,
    backgroundColor: theme.palette.primary.dark
  },
  rightCard: {
    padding: 20,
    backgroundColor: theme.palette.secondary.light
  },
  fonts: {
    fontWeight: 'bold',
    color: '#fff'
  },
  image: {
    marginTop: 10,
    margin: 5
  }
}));

export default useHighlightAnalysisHeroStyles;
