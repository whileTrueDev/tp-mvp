import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export const useCreatorCommentItemStyle = makeStyles((theme: Theme) => {
  const deleteButtonSize = theme.spacing(2);

  return createStyles({
    commentItem: {
      position: 'relative',
      padding: theme.spacing(2, 4),
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing(1),
    },
    userInfo: {
      display: 'flex',
      '&>*': {
        marginRight: theme.spacing(1),
      },
      '& .nickname': {
        fontSize: theme.typography.body1.fontSize,
        fontWeight: theme.typography.fontWeightMedium,
      },
      '& .userId': {
        color: theme.palette.text.secondary,
      },
    },
    smallAvatar: {
      width: theme.spacing(3),
      height: theme.spacing(3),
    },
    largeAvatar: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
    headerActions: {
      display: 'flex',
      alignItems: 'center',
    },
    deleteButton: {
      marginLeft: theme.spacing(1),
      width: deleteButtonSize,
      minWidth: deleteButtonSize,
      height: deleteButtonSize,
      backgroundColor: theme.palette.text.secondary,
      color: theme.palette.common.white,
    },
    deleteButtonIconImage: {
      fontSize: theme.typography.body2.fontSize,
    },
    reportButton: {

    },
    content: {

    },
    actions: {
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },
    nestedComments: {

    },
    recommendIcons: {
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
  });
});

export const useCreatorCommentListStyle = makeStyles((theme: Theme) => createStyles({
  commentsContainer: {

  },
  commentFilterContainer: {

  },
  commentFilterButton: {
    fontSize: theme.typography.h6.fontSize,
    color: theme.palette.text.disabled,
    '&.selected': {
      color: theme.palette.text.primary,
      fontWeight: theme.typography.fontWeightBold,
    },
  },
  commentListContainer: {
    minHeight: theme.spacing(45),

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
    border: `1px solid ${theme.palette.divider}`,
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2.5),
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
  contentTextArea: {
    '& .MuiInput-underline:before': {
      borderBottom: 'none',
    },
  },
  buttonWrapper: {
    textAlign: 'right',
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.background.paper,
    fontSize: theme.typography.h6.fontSize,
    fontWeight: theme.typography.fontWeightBold,
  },
}));
