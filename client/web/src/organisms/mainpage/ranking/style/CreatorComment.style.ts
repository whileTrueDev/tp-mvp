import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

export const useCreatorCommentItemStyle = makeStyles((theme: Theme) => {
  const smallTextSize = theme.spacing(1.75);
  const likeColor = '#ee6d6d';
  const hateColor = '#7777ee';
  return createStyles({
    commentItem: {
      position: 'relative',
      padding: theme.spacing(0.5, 1, 0, 1),
      '& .time': { fontSize: theme.spacing(1.25) },
      '& .nickname': {
        [theme.breakpoints.down('sm')]: {
          fontSize: theme.typography.caption.fontSize,
        },
      },
      '&:not(:first-child)': {
        borderTop: `1px solid ${theme.palette.divider}`,
      },
      '&.child': {
        marginLeft: theme.spacing(6),
        paddingLeft: theme.spacing(4),
        paddingRight: 0,
        paddingBottom: theme.spacing(1),
        borderTop: `1px solid ${theme.palette.divider}`,
        [theme.breakpoints.down('sm')]: {
          marginLeft: theme.spacing(2),
          paddingLeft: theme.spacing(2),
        },
        '&::before': {
          content: '"ㄴ"',
          position: 'absolute',
          left: theme.spacing(2),
          top: theme.spacing(2),
          [theme.breakpoints.down('sm')]: {
            left: theme.spacing(0),
          },
        },
      },
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing(1),
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      '&>*': {
        marginRight: theme.spacing(1),
      },
      '& .nickname': {
        fontSize: theme.typography.body2.fontSize,
        fontWeight: theme.typography.fontWeightMedium,
      },
      '& .userId': {
        fontSize: theme.spacing(0.75),
        color: theme.palette.text.secondary,
      },
    },
    smallAvatar: {
      width: theme.spacing(2),
      height: theme.spacing(2),
    },
    largeAvatar: {
      width: theme.spacing(7),
      height: theme.spacing(7),
    },
    headerActions: {
      display: 'flex',
      alignItems: 'center',
    },
    reportButton: {
      '& img': {
        width: 28,
        height: 12,
      },
    },
    content: {
      fontSize: theme.typography.body1.fontSize,
      [theme.breakpoints.down('sm')]: {
        fontSize: theme.typography.body2.fontSize,
      },
    },
    actions: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      '.child &': {
        justifyContent: 'flex-end',
      },
      '& .MuiButton-label': {
        fontSize: smallTextSize,
      },
    },
    replyIcon: {
      transform: 'rotate(180deg)',
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
      fontSize: smallTextSize,
      fontWeight: 'bold',
      '.likeButton &': {
        color: likeColor,
      },
      '.hateButton &': {
        color: hateColor,
      },
    },
    liked: {
    },
    hated: {
    },
    commentFormContainer: {
      display: 'none',
      '&.open': {
        display: 'block',
      },
    },
    replyList: {
      display: 'none',
      '&.open': {
        display: 'block',
      },
    },
  });
});

export const useCreatorCommentListStyle = makeStyles((theme: Theme) => createStyles({
  commentsContainer: {

  },
  commentFilterContainer: {

  },
  commentFilterButton: {
    fontSize: theme.typography.body1.fontSize,
    color: theme.palette.text.disabled,
    '&.selected': {
      color: theme.palette.text.primary,
      fontWeight: theme.typography.fontWeightBold,
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.typography.body2.fontSize,
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
    padding: theme.spacing(1),
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
    [theme.breakpoints.down('sm')]: {
      '& input': {
        fontSize: theme.spacing(1.5),
      },
      '& label': {
        fontSize: theme.spacing(1.5),
      },
    },
  },
  passwordInput: {
    [theme.breakpoints.down('sm')]: {
      '& input': {
        fontSize: theme.spacing(1.5),
      },
      '& label': {
        fontSize: theme.spacing(1.5),
      },
    },
  },
  contentTextArea: {
    '& .MuiInput-underline:before': {
      borderBottom: 'none',
    },
    [theme.breakpoints.down('sm')]: {
      '& textarea': {
        fontSize: theme.spacing(1.5),
      },
    },
  },
  buttonWrapper: {
    textAlign: 'right',
  },
  button: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    fontSize: theme.typography.body1.fontSize,
    fontWeight: theme.typography.fontWeightBold,
    '&:hover': {
      backgroundColor: theme.palette.secondary.dark, // lighten(theme.palette.secondary.main, 0.2),
    },
    [theme.breakpoints.down('sm')]: {
      fontSize: theme.spacing(1.5),
    },
  },
}));

export const useCommentContainerStyles = makeStyles((theme: Theme) => createStyles({
  commentSectionWrapper: {
    padding: theme.spacing(3),
    paddingBottom: theme.spacing(20),
    [theme.breakpoints.down('sm')]: {
      border: `1px solid ${theme.palette.divider}`,
      padding: 0,
    },
    backgroundImage: 'url(/images/rankingPage/streamer_detail_bg_1.svg)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'left bottom',
    backgroundSize: 'contain',
  },
}));
