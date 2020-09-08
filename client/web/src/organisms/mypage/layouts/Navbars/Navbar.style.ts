import { makeStyles, Theme } from '@material-ui/core/styles';

const useNavbarStyles = makeStyles((theme: Theme) => ({
  appBar: {
    backgroundColor: '#4B5AC7',
    boxShadow: 'none',
    borderBottom: '0',
    marginBottom: '0',
    position: 'relative',
    maxWidth: '1510px',
    zIndex: 10,
    color: '#ffff',
    border: '0',
    borderRadius: '3px',
    padding: '0px',
    transition: 'all 150ms ease 0s',
    height: '98px',
    display: 'block',
    alignItems: 'center',
  },
  container: {
    paddingRight: '0px',
    paddingLeft: '0px',
    marginRight: 'auto',
    marginLeft: 'auto',
    height: '100%'
  },
  flex: {
    flex: 1,
  },
  title: {
    lineHeight: '100%',
    fontSize: '40px',
    borderRadius: '3px',
    textTransform: 'none',
    fontWeight: 'bold',
    marginRight: '5px',
    '&:hover,&:focus': {
      textDecoration: 'underline'
    },
  },
  leftGridIcon: {
    fontSize: '32px',
    marginTop: '9px',
  },
  rightGridIcon: {
    fontSize: '27px',
    marginRight: '27px',
  },
  useNameButton: {
    padding: '0px',
    height: '100%',
    marginLeft: '107px',
    marginRight: '15px'
  },

}));

export default useNavbarStyles;
