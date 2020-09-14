import { makeStyles } from '@material-ui/core';

const useHighlightAnalysisLayoutStyles = makeStyles((theme) => ({
  root: {
    padding: 30
  },
  title: {
    fontWeight: 'bold',
    fontSize: '30px'
  },
  sub: {
    fontSize: 22,
    color: '#4d4f5c'
  },
  checkedStream: {
    padding: 30
  },
  checkedStreamFont: {
    fontSize: 22,
    fontweight: 'bold',
    color: '#4d4f5c'
  },
  cardText: {
    fontsize: 40,
    fontWeight: 'bold',
    color: '#4d4f5c'
  },
  card: {
    width: '15vw',
    height: '2vw',
    paddingTop: 6,
    textAlign: 'center',
    background: '#e4e4e4'
  }
}));

export default useHighlightAnalysisLayoutStyles;
