import {
  Button, Grid, List, ListItem, TextField, Typography,
} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';
import SendIcon from '@material-ui/icons/Send';
import { useSnackbar } from 'notistack';
import React, { useCallback, useEffect, useRef } from 'react';
import CenterLoading from '../../../atoms/Loading/CenterLoading';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import { isAvailableNickname, UNAVAILABLE_NICKNAME_ERROR_MESSAGE } from '../../../utils/checkAvailableNickname';
import useUserReactionMutation from '../../../utils/hooks/mutation/useUserReactionMutation';
import useUserReactions from '../../../utils/hooks/query/useUserReaction';
import { useUserReactionStyle } from './style/UserReactionCard.style';
import UserReactionListItem from './sub/UserReactionListItem';

export default function UserReactionCard(): JSX.Element {
  const classes = useUserReactionStyle();
  const { enqueueSnackbar } = useSnackbar();
  const formRef = useRef<HTMLFormElement>(null);
  const listContainerRef = useRef<HTMLUListElement>(null);

  const scrollToBottom = useCallback(() => {
    if (!listContainerRef.current) return;
    const { scrollHeight, clientHeight } = listContainerRef.current;
    listContainerRef.current.scrollTop = scrollHeight - clientHeight;
  }, []);

  const {
    data: chatData, isFetching, isLoading, refetch,
  } = useUserReactions();

  const { mutateAsync } = useUserReactionMutation();

  const loadUserReactions = useCallback(() => {
    refetch().then(() => {
      scrollToBottom();
    }).catch((e) => {
      console.error('시청자 반응 데이터 불러오기 오류', e);
    });
  }, [refetch, scrollToBottom]);

  useEffect(() => {
    if (chatData) scrollToBottom();
  }, [scrollToBottom, chatData]);

  // 등록버튼 클릭 | 인풋창에서 엔터 누를 시 실행되는 핸들러
  const handleSubmit = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) return;

    // 닉네임 확인
    const userNickname = formRef.current.username.value.trim();
    if (!isAvailableNickname(userNickname)) {
      ShowSnack(UNAVAILABLE_NICKNAME_ERROR_MESSAGE, 'error', enqueueSnackbar);
      return;
    }
    // 비밀번호 내용 확인
    if (formRef.current.content.value.trim() === '' || formRef.current.password.value.trim() === '') {
      ShowSnack('비밀번호와 내용을 입력해주세요', 'error', enqueueSnackbar);
      return;
    }

    // 잡담방 데이터 생성 요청
    await mutateAsync({
      username: formRef.current.username.value.trim() || '시청자',
      password: formRef.current.password.value,
      content: formRef.current.content.value,
    }).then(() => {
      scrollToBottom();
      if (formRef.current) {
        formRef.current.username.value = '';
        formRef.current.content.value = '';
        formRef.current.password.value = '';
        formRef.current.content.focus();
      }
    });
  }, [enqueueSnackbar, mutateAsync, scrollToBottom]);

  return (
    <section className={classes.userReactionContainer}>
      <header className={classes.header}>
        <Typography className={classes.title}>잡담방</Typography>
        <Button size="small" variant="outlined" onClick={loadUserReactions}>
          <RefreshIcon />
          새로고침
        </Button>
      </header>

      <List className={classes.list} ref={listContainerRef}>
        {(isFetching || isLoading) && <CenterLoading />}
        {chatData && chatData.map((data) => (
          <UserReactionListItem
            key={data.id}
            data={data}
            reloadItems={loadUserReactions}
          />
        ))}
        {!chatData && !isFetching && !isLoading && <ListItem>데이터가 없습니다</ListItem>}
      </List>

      <form className={classes.form} onSubmit={handleSubmit} ref={formRef}>
        <Grid container className={classes.row}>
          <TextField
            size="small"
            className={classes.nicknameField}
            name="username"
            placeholder="닉네임"
            inputProps={{ maxLength: 8 }}
            variant="outlined"
          />
          <TextField
            size="small"
            className={classes.passwordField}
            name="password"
            type="password"
            placeholder="비밀번호"
            inputProps={{ maxLength: 4 }}
            variant="outlined"
          />
        </Grid>
        <Grid container className={classes.row}>
          <TextField
            name="content"
            className={classes.contentField}
            placeholder="여러분들의 의견을 올려주세요"
            inputProps={{ maxLength: 50 }}
            variant="outlined"
            multiline
            rows={2}
          />
          <div>
            <Button
              className={classes.submitButton}
              type="submit"
              variant="outlined"
            >
              <SendIcon className={classes.submitButtonIcon} />
            </Button>
          </div>
        </Grid>

      </form>
    </section>

  );
}
