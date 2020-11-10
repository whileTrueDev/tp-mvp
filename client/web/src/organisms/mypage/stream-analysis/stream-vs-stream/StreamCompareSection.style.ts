import { Theme, makeStyles } from '@material-ui/core/styles';

const useStreamSectionStyles = makeStyles((theme: Theme) => ({
  root: {
    marginTop: theme.spacing(4),
  },
  mainTitle: {
    color: theme.palette.text.primary,
    letterSpacing: '-1.2px',
    textAlign: 'left',
    lineHeight: 1.33,
    fontWeight: 500,
    fontSize: '30px',
    fontFamily: 'AppleSDGothicNeo',
    marginBottom: '28px',
  },
  mainBody: {
    color: theme.palette.text.secondary,
    letterSpacing: 'normal',
    textAlign: 'left',
    lineHeight: 1.5,
    fontSize: '22px',
    fontFamily: 'AppleSDGothicNeo',
    marginBottom: '28px',
  },
  bodyPapper: {
    borderRadius: '12px',
    border: `solid 1px ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    width: 'auto',
    height: '75px',
    paddingTop: '22.5px',
    paddingBottom: '10.5px',
    boxShadow: '0',
  },
  subTitle: {
    color: theme.palette.text.secondary,
    letterSpacing: 'normal',
    textAlign: 'left',
    lineHeight: 1.5,
    fontSize: '22px',
    fontFamily: 'AppleSDGothicNeo',
    marginLeft: '45.5px',
    display: 'flex',
    alignItems: 'center',
  },
  bodyWrapper: {
    borderRadius: '12px',
    hegith: '292px',
    border: `solid 1px ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    paddingTop: '22.5px',
    paddingBottom: '18.5px',
    paddingRight: '0px',
    marginRight: '42px',
  },
  bodyTitle: {
    color: theme.palette.text.secondary,
    letterSpacing: 'normal',
    textAlign: 'center',
    lineHeight: 1.5,
    fontSize: '17px',
    fontFamily: 'AppleSDGothicNeo',
    marginLeft: '45.5px',
    marginRight: '35.5px',
    display: 'flex',
    marginBottom: '5px',
  },
  anlaysisButton: {
    width: '136.2px',
    height: '51.1px',
    borderRadius: '6px',
    backgroundColor: theme.palette.primary.dark,
    fontFamily: 'AppleSDGothicNeo',
    fontSize: '24px',
    marginTop: '20px',
    marginRight: '93.5px',
    color: theme.palette.common.white,
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
  },
  alert: {
    borderRadius: '5px',
    marginBottom: '12px',
    paddingTop: '4px',
  },
}));

export default useStreamSectionStyles;
