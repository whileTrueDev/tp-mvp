import { Theme, makeStyles } from '@material-ui/core/styles';

const useStreamSectionStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: theme.spacing(4),
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
    fontSize: '24px',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
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
