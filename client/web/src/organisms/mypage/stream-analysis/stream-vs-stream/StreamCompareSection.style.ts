import { Theme, makeStyles } from '@material-ui/core/styles';

const useStreamSectionStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(6),
  },
  mainTitle: {
    color: theme.palette.text.primary,
    letterSpacing: '-1.2px',
    textAlign: 'left',
    lineHeight: 1.33,
    fontWeight: 500,
    fontSize: '30px',
    fontFamily: 'AppleSDGothicNeo',
    marginBottom: theme.spacing(5),
  },
  mainBody: {
    color: theme.palette.text.secondary,
    letterSpacing: 'normal',
    textAlign: 'left',
    lineHeight: 1.5,
    fontSize: '22px',
    fontFamily: 'AppleSDGothicNeo',
    marginBottom: theme.spacing(4),
  },
  bodyPapper: {
    borderRadius: '12px',
    border: `solid 1px ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    width: 'auto',
    height: '75px',
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(2),
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
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    paddingRight: 0,
    marginRight: theme.spacing(5),
  },
  bodyTitle: {
    color: theme.palette.text.secondary,
    letterSpacing: 'normal',
    textAlign: 'center',
    lineHeight: 1.5,
    fontSize: '17px',
    fontFamily: 'AppleSDGothicNeo',
    marginLeft: theme.spacing(6),
    marginRight: theme.spacing(5),
    display: 'flex',
    marginBottom: theme.spacing(1),
  },
  anlaysisButton: {
    width: '136.2px',
    height: '51.1px',
    borderRadius: '6px',
    backgroundColor: theme.palette.primary.dark,
    fontFamily: 'AppleSDGothicNeo',
    fontSize: '24px',
    marginTop: theme.spacing(3),
    marginRight: theme.spacing(10),
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.light,
    },
  },
  alert: {
    borderRadius: '5px',
    marginBottom: theme.spacing(0),
    paddingTop: theme.spacing(1),
  },
  calendarAndListWrapper: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  selectIcon: {
    fontSize: '28.5px', marginRight: theme.spacing(3),
  },
  streamSelectWrapper: {
    width: '666px', marginRight: theme.spacing(2),
  },
}));

export default useStreamSectionStyles;
