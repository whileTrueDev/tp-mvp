import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles(() => ({
  root: {
    width: '100%',
    margin: '70px 0px 30px 0px'
  },
  mainTitle: {
    fontFamily: 'AppleSDGothicNeo',
    fontSize: 40,
    fontWeight: 700,
    margin: '30px 0px 30px 0px'
  },
  solutionWraper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  solution: {
    width: '100%',
    margin: '40px 0px 40px 0px',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  mainContent: {
    display: 'block',
  },
  eachTitle: {
    fontFamily: 'AppleSDGothicNeo',
    fontSize: 27,
    fontWeight: 700,
  },
  eachContent: {
    fontFamily: 'AppleSDGothicNeo',
    fontSize: 20,
    margin: '10px 0px 10px 0px'
  },
  stepOne: {
    width: 400,
    height: 400,
    marginLeft: 200 
  },
  stepTwo: {
    width: 400,
    height: 400,
    marginRight: 100,
    marginLeft: 100
  },
  stepThree: {
    width: 400,
    height: 400,
    marginLeft: 200
  },
  stepOneLine: {
    width: 0,
    height: 150,
    borderRight: '5px solid #a8c4f9',
    marginLeft: 30
  },
  stepTwoLine: {
    width: 100,
    height: 0,
    borderBottom: '5px solid #a8c4f9',
    marginRight: 30
  },
  stepThreeLine: {
    width: 0,
    height: 200,
    borderRight: '5px solid #a8c4f9',
    margin: '0px 15px 0px 15px'
  },
  accent: {
    color: '#a8c4f9',
    fontFamily: 'AppleSDGothicNeo',
    fontSize: 27,
    fontWeight: 700,
    marginTop: 100
  },
  mainBottomLine: {
    width: 0,
    borderRight: '2px dotted #a8c4f9',
    height: '150px',
    margin: '40px 0px 30px 0px'
  },
  finishComment: {
    fontFamily: 'AppleSDGothicNeo',
    fontSize: 40,
    fontWeight: 800,
    margin: '20px 0px 20px 0px'
  },
  arrowSVG: {
    width: 50,
    height: 25,
    fill: 'none',
    stroke: '#a8c4f9',
    strokeWidth: '5px',
    marginTop: 30
  }
}));

export default styles;