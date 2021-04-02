import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export const useCreatorCommentItemStyle = makeStyles((theme: Theme) => createStyles({
  commentItem: {
    position: 'relative',
    padding: theme.spacing(2),
    '&:not(:last-child)': {
      border: `1px solid ${theme.palette.divider}`,
    },
  },
  header: {
    '&>*': {
      marginRight: theme.spacing(1),
    },
    '& .nickname': {

    },
    '& .time': {
      color: theme.palette.text.secondary,
    },
    marginBottom: theme.spacing(1),
  },
  content: {

  },
  actions: {
    position: 'absolute',
    right: theme.spacing(2),
    top: theme.spacing(1),
    '&>*:not(:last-child)': {
      marginRight: theme.spacing(1),
    },
  },
  countText: {
    marginLeft: theme.spacing(1),
  },
  liked: {
    color: 'red',
  },
  hated: {
    color: 'blue',
  },
}));
