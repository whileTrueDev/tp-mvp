import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export const useUserReactionStyle = makeStyles((theme: Theme) => createStyles({
  userReactionContainer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
  },
  list: {
    maxHeight: theme.spacing(40),
    overflowY: 'auto',
    borderTop: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  form: {
    width: '100%',
    padding: theme.spacing(2, 0),
    '& input': {
      padding: theme.spacing(1.5, 2),
    },
  },
  formRow: {
    marginBottom: theme.spacing(0.8),
    '&>*': {
      marginRight: theme.spacing(0.6),
    },
  },
}));
