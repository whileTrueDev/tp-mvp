import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

export const useUserReactionStyle = makeStyles((theme: Theme) => {
  const grey = theme.palette.grey[500];
  return createStyles({
    userReactionContainer: {
      border: `${theme.spacing(1)}px solid ${theme.palette.common.black}`,
      borderRadius: theme.shape.borderRadius,
      backgroundColor: theme.palette.background.paper,
      padding: theme.spacing(2, 6, 0, 6),
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: theme.spacing(2, 0),
      color: theme.palette.text.primary,
    },
    title: {
      fontSize: theme.typography.h6.fontSize,
      fontWeight: theme.typography.fontWeightBold,
    },
    list: {
      minHeight: theme.spacing(50),
      maxHeight: theme.spacing(50),
      overflowY: 'auto',
      borderTop: `1px solid ${theme.palette.divider}`,
      borderBottom: `1px solid ${theme.palette.divider}`,
    },
    form: {
      width: '100%',
      padding: theme.spacing(2, 0),
      // '& .MuiFormControl-root': {
      //   border: `2px solid ${grey}`,
      //   borderRadius: theme.spacing(0.75),
      // },
    },
    row: {
      '&:not(:last-child)': {
        marginBottom: theme.spacing(2),
      },
      '&>*:not(:last-child)': {
        marginRight: theme.spacing(1),
      },
    },
    nicknameField: {
      width: '40%',
    },
    passwordField: {
      width: '30%',
    },
    contentField: {
      width: '90%',
    },
    submitButton: {
      border: `2px solid ${grey}`,
      minWidth: theme.spacing(4),
      width: theme.spacing(4),
      height: theme.spacing(4),
    },
    submitButtonIcon: {
      color: grey,
    },

  });
});
