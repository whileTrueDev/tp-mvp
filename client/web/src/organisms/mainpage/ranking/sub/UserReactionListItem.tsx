import {
  ListItem, Avatar, ListItemAvatar, ListItemText, Typography,
} from '@material-ui/core';
import React, { memo, useCallback, useRef } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';

import { UserReaction as IUserReaction } from '@truepoint/shared/dist/interfaces/UserReaction.interface';
import DeleteButton from './DeleteButton';
import PasswordConfirmDialog from './PasswordConfirmDialog';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import useDialog from '../../../../utils/hooks/useDialog';
import axios from '../../../../utils/axios';
import { dayjsFormatter } from '../../../../utils/dateExpression';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';

const useUserReactionListItemStyle = makeStyles((theme: Theme) => createStyles({
  itemPrimaryText: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
    color: theme.palette.grey.A700,
    '&>span': {
      color: theme.palette.grey[600],
    },
  },
  itemContent: {
    lineBreak: 'anywhere',
    whiteSpace: 'pre-line',
    fontSize: theme.typography.body2.fontSize,
  },
  avatar: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  avatarContainer: {
    minWidth: theme.spacing(4),
  },
}));

export interface UserReactionListItemProps{
  data: IUserReaction,
  reloadItems?: () => void
}

function UserReactionListItem(props: UserReactionListItemProps): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useUserReactionListItemStyle();
  const { data, reloadItems } = props;
  const {
    username, content, id,
  } = data;

  const inputRef = useRef<HTMLInputElement>(null);
  const { open: isPasswordDialogOpen, handleOpen: openPasswordDialog, handleClose: closePasswordDialog } = useDialog();
  const { open: isConfirmDialogOpen, handleOpen: openConfirmDialog, handleClose: closeConfirmDialog } = useDialog();
  const date = dayjsFormatter(data.createDate, 'hh:mm A');

  const onDeleteButtonClick = useCallback(() => {
    openPasswordDialog();
  }, [openPasswordDialog]);

  const checkPassword = () => {
    if (!inputRef.current) return;
    const password = inputRef.current.value.trim();
    if (!password || password.length === 0) {
      ShowSnack('비밀번호를 입력해주세요', 'error', enqueueSnackbar);
    }
    axios.post(`/user-reactions/password/${id}`, { password })
      .then((res) => {
        const result = res.data;
        if (!result) {
          ShowSnack('비밀번호가 틀렸습니다. 다시 확인해주세요', 'error', enqueueSnackbar);
          if (inputRef.current) {
            inputRef.current.value = '';
          }
          return;
        }
        closePasswordDialog();
        openConfirmDialog();
      })
      .catch((error) => {
        console.error(error);
        if (error.response.statue === 400) {
          ShowSnack('이미 삭제된 글입니다', 'error', enqueueSnackbar);
        }
      });
  };
  const deleteItem = () => {
    axios.delete(`/user-reactions/${id}`)
      .then((res) => {
        closeConfirmDialog();
        if (res.status === 200) { // 삭제 성공한 경우
          if (reloadItems) {
            reloadItems();
          }
        }
      })
      .catch((error) => console.error(error));
  };
  return (
    <>
      <ListItem alignItems="flex-start">
        <ListItemAvatar className={classes.avatarContainer}>
          <Avatar className={classes.avatar} />
        </ListItemAvatar>
        <ListItemText
          classes={{ primary: classes.itemPrimaryText }}
          primary={(
            <>
              <Typography>{`${username}`}</Typography>
              <div>
                <Typography variant="caption" component="span">{date}</Typography>
                <DeleteButton onClick={onDeleteButtonClick} />
              </div>

            </>
    )}
          secondary={
            <Typography className={classes.itemContent}>{content}</Typography>
    }
        />
      </ListItem>
      <PasswordConfirmDialog
        open={isPasswordDialogOpen}
        onClose={closePasswordDialog}
        passwordInputRef={inputRef}
        callback={checkPassword}
      />
      <DeleteConfirmDialog
        open={isConfirmDialogOpen}
        onClose={closeConfirmDialog}
        callback={deleteItem}
      />
    </>
  );
}

export default memo(UserReactionListItem);
