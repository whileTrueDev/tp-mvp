import {
  Button, Grid, List, ListItem, TextField, Typography,
} from '@material-ui/core';
import React, {
  useEffect, useRef, useCallback, useLayoutEffect,
} from 'react';
import SendIcon from '@material-ui/icons/Send';
import RefreshIcon from '@material-ui/icons/Refresh';
import { useSnackbar } from 'notistack';
import useAxios from 'axios-hooks';

import { CreateUserReactionDto } from '@truepoint/shared/dist/dto/userReaction/createUserReaction.dto';
import { UserReaction as IUserReaction } from '@truepoint/shared/dist/interfaces/UserReaction.interface';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import CenterLoading from '../../../atoms/Loading/CenterLoading';
import UserReactionListItem from './sub/UserReactionListItem';
import { useUserReactionStyle } from './style/UserReactionCard.style';

const userReactionUrl = '/user-reactions';
export default function UserReactionCard(): JSX.Element {
  const classes = useUserReactionStyle();
  const { enqueueSnackbar } = useSnackbar();
  const formRef = useRef<HTMLFormElement>(null);
  const listContainerRef = useRef<HTMLUListElement>(null);

  const [{
    data: userReactionData,
    loading,
  }, getUserReactions] = useAxios<IUserReaction[]>(userReactionUrl, { manual: true });
  const [, postUserReaction] = useAxios<IUserReaction>({
    url: userReactionUrl,
    method: 'post',
  }, { manual: true });

  // api요청 핸들러
  const loadUserReactions = useCallback(() => {
    getUserReactions().catch((e) => {
      console.error('시청자 반응 데이터 불러오기 오류', e);
    });
  }, [getUserReactions]);

  const createUserReaction = useCallback((createUserReactionDto: CreateUserReactionDto) => {
    postUserReaction({
      data: createUserReactionDto,
    }).then(() => {
      if (formRef.current) {
        formRef.current.username.value = '';
        formRef.current.content.value = '';
        formRef.current.password.value = '';
        formRef.current.content.focus();
      }
      loadUserReactions();
    }).catch((err) => {
      console.error('시청자 반응 생성 에러', err);
    });
  }, [loadUserReactions, postUserReaction]);

  // 마운트 시 한번만 실행
  useEffect(() => {
    loadUserReactions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 새로운 데이터 로드 후 ul스크롤 위치를 최하단으로
  useLayoutEffect(() => {
    if (!listContainerRef.current) return;
    const { scrollHeight, clientHeight } = listContainerRef.current;
    listContainerRef.current.scrollTop = scrollHeight - clientHeight;
  }, [userReactionData]);

  // 등록버튼 클릭 | 인풋창에서 엔터 누를 시 실행되는 핸들러
  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) {
      return;
    }
    if (formRef.current.content.value.trim() === '' || formRef.current.password.value.trim() === '') {
      ShowSnack('비밀번호와 내용을 입력해주세요', 'error', enqueueSnackbar);
      return;
    }
    createUserReaction({
      username: formRef.current.username.value.trim() || '시청자',
      password: formRef.current.password.value,
      content: formRef.current.content.value,
    });
  }, [createUserReaction, enqueueSnackbar]);

  return (
    <section className={classes.userReactionContainer}>
      <header className={classes.header}>
        <Typography className={classes.title}>잡담방</Typography>
        <Button variant="outlined" onClick={loadUserReactions}>
          <RefreshIcon />
          새로고침
        </Button>
      </header>

      <List className={classes.list} ref={listContainerRef}>
        {loading && <CenterLoading />}
        { userReactionData && userReactionData.length !== 0
        /* 데이터가 있는 경우 */
          ? userReactionData.map((data) => (
            <UserReactionListItem
              key={data.id}
              data={data}
              reloadItems={loadUserReactions}
            />
          ))
        /* 데이터가 없는 경우 */
          : <ListItem>데이터가 없습니다</ListItem>}
      </List>

      <form className={classes.form} onSubmit={handleSubmit} ref={formRef}>
        <Grid container className={classes.row}>
          <TextField
            className={classes.nicknameField}
            name="username"
            placeholder="닉네임"
            inputProps={{ maxLength: 8 }}
            variant="outlined"
          />
          <TextField
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
