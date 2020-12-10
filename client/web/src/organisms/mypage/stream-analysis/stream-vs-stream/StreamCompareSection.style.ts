import { Theme, makeStyles } from '@material-ui/core/styles';

const useStreamSectionStyles = makeStyles((theme: Theme) => ({
  root: { padding: theme.spacing(4) },
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
    marginBottom: theme.spacing(2),
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
