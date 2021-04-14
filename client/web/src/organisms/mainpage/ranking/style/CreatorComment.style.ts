import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export const useCreatorCommentItemStyle = makeStyles((theme: Theme) => createStyles({
  commentItem: {
    backgroundColor: theme.palette.background.paper,
    position: 'relative',
    padding: theme.spacing(2, 4),
    border: `1px solid ${theme.palette.divider}`,
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
  actionButton: {
    color: theme.palette.action.disabled,
  },
  countText: {
    marginLeft: theme.spacing(1),
  },
  liked: {
    color: theme.palette.primary.main,
  },
  hated: {
    color: theme.palette.secondary.main,
  },
}));

export const useCreatorCommentListStyle = makeStyles((theme: Theme) => createStyles({
  bestCommentsContainer: {
    marginBottom: theme.spacing(2),
  },
  commentsContainer: {

  },
  buttonWrapper: {
    display: 'flex',
    justifyContent: 'center',
  },
  emptyList: {
    padding: theme.spacing(2),
  },
}));

export const useCreatorCommentFormStyle = makeStyles((theme: Theme) => createStyles({
  form: {
    display: 'flex',
    border: `${theme.spacing(0.5)}px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    marginBottom: theme.spacing(2),
  },
  inputWrapper: {
    flex: 1,
    padding: theme.spacing(1),
    '& .MuiInput-underline:before': {
      borderBottom: 'none',
    },
  },
  nicknameInput: {
    marginRight: theme.spacing(1),
  },
  button: {
    width: theme.spacing(20),
    backgroundColor: theme.palette.action.active,
    color: theme.palette.background.paper,
    fontSize: theme.typography.h6.fontSize,
    fontWeight: theme.typography.fontWeightBold,
  },
}));
