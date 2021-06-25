import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export const useStyle = makeStyles((theme: Theme) => createStyles({
  contents: {
    display: 'grid',
    gridTemplateColumns: '1fr 3fr',
    margin: theme.spacing(2, 0),
  },
  thead: {
    padding: theme.spacing(3),
    minHeight: '150px',
    fontSize: theme.typography.body1.fontSize,
    fontWeight: 700,
    borderRight: '1px solid #e5e5e5',
    borderBottom: '1px solid #e5e5e5',
    backgroundColor: '#f9f9f9',
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.body2.fontSize,
    },
  },
  tsub: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(2),
    fontSize: theme.typography.caption.fontSize,
    color: '#8e8e8e',
  },
  tbody: {
    padding: theme.spacing(3),
    fontSize: theme.typography.body1.fontSize,
    borderBottom: '1px solid #e5e5e5',
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.body2.fontSize,
    },
  },
  tbutton: {
    padding: theme.spacing(0.7),
    marginTop: theme.spacing(1),
    fontSize: theme.typography.caption.fontSize,
  },
  optionButton: {
    padding: theme.spacing(0.3),
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(0.5),
    fontSize: theme.typography.caption.fontSize,
  },
  nickInput: {
    marginTop: theme.spacing(3),
  },
}));
