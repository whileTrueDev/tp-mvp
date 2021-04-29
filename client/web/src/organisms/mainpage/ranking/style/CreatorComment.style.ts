import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export const useCreatorCommentItemStyle = makeStyles((theme: Theme) => createStyles({
  commentItem: {
    position: 'relative',
    padding: theme.spacing(2),
    '&:not(:first-child)': {
      borderTop: `1px solid ${theme.palette.divider}`,
    },
    '&.child': {
      marginLeft: theme.spacing(6),
      paddingLeft: theme.spacing(4),
      paddingRight: 0,
      borderTop: `1px solid ${theme.palette.divider}`,
      '&::before': {
        content: '"ㄴ"',
        position: 'absolute',
        left: theme.spacing(2),
        top: theme.spacing(2),
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
    '&>*': {
      marginRight: theme.spacing(1),
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
  reportButton: {

  },
  content: {
    padding: theme.spacing(2, 0),
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    '.child &': {
      justifyContent: 'flex-end',
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
    marginLeft: theme.spacing(1),
  },
  liked: {
    color: theme.palette.primary.main,
  },
  hated: {
    color: theme.palette.secondary.main,
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
}));

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

export const useCommentContainerStyles = makeStyles((theme: Theme) => createStyles({
  commentSectionWrapper: {
    padding: theme.spacing(8),
    paddingBottom: theme.spacing(20),
    border: `${theme.spacing(0.5)}px solid ${theme.palette.common.black}`,
    backgroundImage: 'url(/images/rankingPage/streamer_detail_bg_2.svg), url(/images/rankingPage/streamer_detail_bg_3.svg)',
    backgroundRepeat: 'no-repeat, no-repeat',
    backgroundPosition: 'left center, left bottom',
    backgroundSize: '100% 100%, contain',
  },
}));
