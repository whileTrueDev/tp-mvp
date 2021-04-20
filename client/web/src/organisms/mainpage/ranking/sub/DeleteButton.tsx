import { Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import React from 'react';

const useDeleteButtonStyles = makeStyles((theme: Theme) => {
  const deleteButtonSize = theme.spacing(2);
  return createStyles({
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
  });
});

export interface DeleteButtonProps {
  onClick: () => void
}

export default function DeleteButton(props: DeleteButtonProps): JSX.Element {
  const { onClick } = props;
  const classes = useDeleteButtonStyles();
  return (
    <Button className={classes.deleteButton} aria-label="삭제하기" onClick={onClick}>
      <CloseIcon className={classes.deleteButtonIconImage} />
    </Button>
  );
}
