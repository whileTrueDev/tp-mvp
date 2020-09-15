import { makeStyles } from '@material-ui/core/styles';

const styles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(18),
    marginBottom: theme.spacing(6),
  },
  title: {
    fontFamily: 'AppleSDGothicNeo',
    marginTop: '20px',
    marginBottom: '30px',
    fontWeight: 600,
    wordBreak: 'keep-all',
    [theme.breakpoints.down('sm')]: {
      fontSize: '25px',
    }
  },
  subTitle: {
    fontFamily: 'AppleSDGothicNeo',
    wordBreak: 'keep-all',
    [theme.breakpoints.down('sm')]: {
      fontSize: '20px',
    }
  },
  contentWraper: {
    margin: '20px auto',
    wordBreak: 'keep-all',
    // 브레이크 포인트 나눠서 반응형 내용추가 => 폭 너비 및 폰트크기
  },
  cardWrapper: {
    zIndex: 1,
    width: '100%'
  },
  card: {
    margin: '20px auto',
    border: '2px solid #929ef8',
    borderRadius: '10px',
    padding: theme.spacing(8, 3),
    width: '70%',
    [theme.breakpoints.down('xs')]: {
      width: '100%',
    }
  },
  cardContent: {
    marginBottom: theme.spacing(5),
  },
  datailContent: {
    minWidth: 30,
    marginTop: theme.spacing(2),
    borderRadius: 3,
    border: '1px solid #929ef8',
    width: '100%',
    '&:hover': {
      border: '1px solid #929ef8'
    }
  },
  textField: {
    width: '100%',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  checkboxRoot: {
    color: '#929ef8',
    '&$checked': {
      color: '#929ef8',
    },
  },
  detailWrap: {
    padding: '0 16px',
    [theme.breakpoints.down('xs')]: {
      padding: '0 10px',
    }
  },
  checked: {},
  button: {
    width: '200px',
    background: '#929ef8',
    color: 'white',
    height: '50px',
    fontSize: '20px',
    fontFamily: 'AppleSDGothicNeo',
    [theme.breakpoints.down('xs')]: {
      width: '150px',
    }
  },
  detailTitle: {
    fontFamily: 'AppleSDGothicNeo',
    fontWeight: 600,
    color: '#929ef8',
    [theme.breakpoints.down('sm')]: {
      fontSize: '15px',
    }
  },
  inputStyle: {
    boxShadow: '0px 0px 5px #00ace0',
    border: '1px solid #a8c4f9'
  },
  buttonProgress: {
    color: theme.palette.primary.main,
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
}));

export default styles;