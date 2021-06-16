import { makeStyles, Theme, createStyles } from '@material-ui/core';

export const SUN_EDITOR_VIEWER_CLASSNAME = 'sun-editor-editable'; // suneditor로 작성된 글을 innerHTML로 넣을 때 해당 엘리먼트에 붙어야 할 클래스네임
export const useStyles = makeStyles((theme: Theme) => createStyles({
  boardTitle: {},
  headerCard: {},
  viewer: {
    [`& .${SUN_EDITOR_VIEWER_CLASSNAME}`]: {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
    },
  },
  buttonsContainer: {
    padding: theme.spacing(1, 0),
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2),
  },
  postButtons: {
    '&>*+*': {
      marginLeft: theme.spacing(1),
    },
  },
  replyPagenation: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  repliesContainer: {
    marginBottom: theme.spacing(8),
    [theme.breakpoints.down('sm')]: {
      marginBottom: theme.spacing(2),
    },
  },
}));
