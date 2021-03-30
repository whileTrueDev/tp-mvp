import React, {
  memo, useCallback, useRef, useState,
} from 'react';
import {
  makeStyles, Theme, createStyles, Typography, Button, IconButton,
} from '@material-ui/core';
import { CommunityReply } from '@truepoint/shared/dist/interfaces/CommunityReply.interface';
import { UpdateReplyDto } from '@truepoint/shared/dist/dto/communityBoard/updateReply.dto';
import dayjs from 'dayjs';
import EditIcon from '@material-ui/icons/Edit';
import HighlightOffIcon from '@material-ui/icons/HighlightOff';
import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';
import InputField from '../write/InputField';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';

const useReplyItemStyle = makeStyles((theme: Theme) => createStyles({
  replyItem: {
    display: 'flex',
    alignItems: 'center',
    '&>*': {
      wordBreak: 'break-all',
      padding: theme.spacing(1),

    },
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  nickname: {
    width: '20%',
    paddingLeft: theme.spacing(3),
    color: theme.palette.grey[700],
  },
  content: {
    width: '50%',
  },
  date: {
    width: '15%',
  },
  actions: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    width: '15%',
  },
  editButton: {
    padding: theme.spacing(0.5, 1),
    minWidth: theme.spacing(6),
  },
}));

function ReplyItem({
  reply, // 댓글 아이템 하나
  openPopper, // 액션버튼 눌렀을 때 비밀번호 popper를 띄운다
  closePopper, // 수정모드가 아닐 때 비밀번호 popper를 닫는다
  loadReplies, // 댓글 요청하는 함수, 수정/삭제 후 콜백함수에서 필요함
  setReplyEditing, // 댓글이 수정모드임을 부모컴포넌트에서 저장함
}: {
  reply: CommunityReply,
  loadReplies: () => void,
  openPopper: (event: React.MouseEvent<HTMLElement>, replyId: number, action: 'delete'|'edit', callback?: () => void) => void,
  closePopper: () => void,
  setReplyEditing: React.Dispatch<React.SetStateAction<boolean>>
  }): JSX.Element {
  const classes = useReplyItemStyle();
  const { enqueueSnackbar } = useSnackbar();
  const {
    replyId,
    content, nickname, ip, createDate,
  } = reply;

  // 수정모드 토글 상태, isEditMode 에 따라 댓글 내용이 텍스트/인풋으로 변함
  const [isEditMode, setIsEditMode] = useState<boolean>(false);

  const replyContentRef = useRef<HTMLInputElement>(null); // 수정모드일때 input의 ref

  const [, deleteReply] = useAxios({ url: `/community/replies/${replyId}`, method: 'delete' }, { manual: true });
  const [, updateReply] = useAxios({ url: `/community/replies/${replyId}`, method: 'put' }, { manual: true });

  const changeToEditMode = useCallback((event: React.MouseEvent<HTMLElement>) => {
    openPopper(event, replyId, 'edit', () => {
      setIsEditMode(true);
      setReplyEditing(true);
    });
  }, [openPopper, replyId, setReplyEditing]);

  const changegToNormalMode = useCallback(() => {
    setIsEditMode(false);
    setReplyEditing(false);
    closePopper();
  }, [closePopper, setReplyEditing]);

  const doDeleteReply = useCallback((event: React.MouseEvent<HTMLElement>) => {
    openPopper(event, replyId, 'delete', () => {
      deleteReply().then((res) => {
        ShowSnack('댓글이 삭제되었습니다', 'info', enqueueSnackbar);
        loadReplies();
      }).catch((e) => {
        console.error(e);
        ShowSnack('댓글을 삭제하는 중에 오류가 발생했습니다. 잠시 후 다시 시도해주세요', 'error', enqueueSnackbar);
      });
    });
  }, [deleteReply, enqueueSnackbar, loadReplies, openPopper, replyId]);

  const doUpdateReply = () => {
    if (replyContentRef.current) {
      if (replyContentRef.current.value === '') {
        ShowSnack('댓글 내용을 입력해주세요', 'error', enqueueSnackbar);
        return;
      }
      const updateReplyDto: UpdateReplyDto = {
        content: replyContentRef.current.value,
      };
      updateReply({ data: updateReplyDto }).then((res) => {
        ShowSnack('댓글이 수정되었습니다', 'info', enqueueSnackbar);
        loadReplies();
        changegToNormalMode();
      }).catch((e) => {
        console.error(e);
        ShowSnack('댓글을 수정하는 중에 오류가 발생했습니다. 잠시 후 다시 시도해주세요', 'error', enqueueSnackbar);
      });
    }
  };

  return (
    <div className={classes.replyItem}>
      <Typography className={classes.nickname}>{`${nickname}(${ip})`}</Typography>

      <div className={classes.content}>
        { isEditMode
          ? (<InputField defaultValue={content} inputRef={replyContentRef} multiline rows={2} autoFocus />)
          : (<Typography>{content}</Typography>)}
      </div>

      <Typography variant="caption" className={classes.date}>{dayjs(createDate).format('YY-MM-DD HH:mm:ss')}</Typography>
      <div className={classes.actions}>
        {isEditMode
          ? (
            <>
              <Button variant="contained" className={classes.editButton} onClick={changegToNormalMode}>취소</Button>
              <Button variant="contained" className={classes.editButton} color="primary" onClick={doUpdateReply}>입력</Button>
            </>
          )
          : (
            <>
              <IconButton aria-label="수정" onClick={changeToEditMode}><EditIcon /></IconButton>
              <IconButton aria-label="삭제" onClick={doDeleteReply}><HighlightOffIcon /></IconButton>
            </>
          )}
      </div>

    </div>
  );
}

export default memo(ReplyItem);
