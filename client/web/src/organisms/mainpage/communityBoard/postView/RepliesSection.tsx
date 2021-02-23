import React, {
  useCallback, useMemo, useRef, useState,
} from 'react';
import { CommunityReply } from '@truepoint/shared/dist/interfaces/CommunityReply.interface';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import {
  Paper, Typography, Button, Popper,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import useAxios from 'axios-hooks';
import useAnchorEl from '../../../../utils/hooks/useAnchorEl';
import ReplyItem from './ReplyItem';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';

interface SectionProps{
  totalReplyCount?: number,
  replies: CommunityReply[] | undefined,
  loadReplies: () => void
}

export interface ReplyState{
  replyId: number | null,
  action: 'edit'|'delete',
  callback?: null | (() => void)
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  replyContainer: {
    '&>*': {
      marginBottom: theme.spacing(1),
    },
  },
  controls: {
    display: 'flex',
    marginBottom: theme.spacing(1),
  },
  popper: {
    padding: theme.spacing(2),
    '&>input': {
      width: theme.spacing(10),
    },
    '&>button': {
      minWidth: theme.spacing(6),
    },
  },
}));

export default function RepliesSection(props: SectionProps): JSX.Element {
  const { enqueueSnackbar } = useSnackbar();
  const classes = useStyles();
  const {
    totalReplyCount = 0,
    replies = [],
    loadReplies,
  } = props;
  const {
    open, anchorEl, handleAnchorOpen, handleAnchorClose,
  } = useAnchorEl();
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const [replyState, setReplyState] = useState<ReplyState>({
    replyId: null, // 현재 액션 버튼이 클릭된 댓글의 id
    action: 'edit', // 클릭된 액션버튼 타입 'edit' | 'delete'
    callback: null, // 비밀번호 확인 후 실행할 콜백함수
  });

  // 다른 댓글이 편집중인지 여부를 저장
  const [replyEditing, setReplyEditing] = useState<boolean>(false);

  // 비밀번화 확인 api요청 관련
  const passwordCheckUrl = useMemo(() => (`community/replies/${replyState.replyId}/password`), [replyState]);
  const [, checkReplyPassword] = useAxios({ url: passwordCheckUrl, method: 'post' }, { manual: true });

  const checkPassword = useCallback(() => {
    if (passwordInputRef.current) {
      const password = passwordInputRef.current.value.trim();
      if (password === '') {
        ShowSnack('비밀번호를 입력해주세요', 'error', enqueueSnackbar);
        return;
      }

      checkReplyPassword({
        data: { password },
      }).then((res) => {
        const isCorrectPassword = res.data; // 비밀번호가 맞으면 true 아니면 false;
        if (isCorrectPassword) {
          if (replyState.callback) {
            replyState.callback();
          }
        } else {
          ShowSnack('비밀번호가 틀렸습니다', 'error', enqueueSnackbar);
        }
      }).catch((e) => {
        console.error(e);
      });
    }
  }, [checkReplyPassword, enqueueSnackbar, replyState]);

  const clearPasswordInput = useCallback(() => {
    if (passwordInputRef.current) {
      passwordInputRef.current.value = '';
    }
  }, []);

  // openPopper 함수를 ReplyItem에 전달하여
  // replyState(replyId, 수정인지 삭제인지, 비밀번호 확인후 콜백함수)를 받아온다.
  // && popper anchor 위치를 받아와서 popper를 연다
  const openPopper = useCallback((
    event: React.MouseEvent<HTMLElement>,
    replyId: number,
    action: 'delete' | 'edit',
    callback?: () => void,
  ) => {
    if (!replyEditing) {
      clearPasswordInput();
      handleAnchorOpen(event);
      setReplyState({ replyId, action, callback });
    }
  }, [clearPasswordInput, handleAnchorOpen, replyEditing]);

  const closePopper = useCallback(() => {
    clearPasswordInput();
    handleAnchorClose();
  }, [clearPasswordInput, handleAnchorClose]);

  return (
    <section className={classes.replyContainer}>

      <div className={classes.controls}>
        <Typography>{`전체댓글 : ${totalReplyCount} 개`}</Typography>
      </div>

      <Paper>
        {/* 댓글목록 */}
        {replies.map((reply) => (
          <ReplyItem
            key={reply.replyId}
            reply={reply}
            openPopper={openPopper}
            closePopper={closePopper}
            loadReplies={loadReplies}
            setReplyEditing={setReplyEditing}
          />
        ))}
      </Paper>

      <Popper open={open && !replyEditing} anchorEl={anchorEl}>
        <Paper className={classes.popper}>
          <input
            ref={passwordInputRef}
            placeholder="비밀번호"
            type="password"
            maxLength={4}
          />
          <Button variant="contained" color="primary" size="small" onClick={checkPassword}>입력</Button>
          <Button variant="contained" size="small" onClick={closePopper}>닫기</Button>
        </Paper>
      </Popper>
    </section>
  );
}
