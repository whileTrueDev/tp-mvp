import {
  Button, List, ListItem, TextField, Typography,
} from '@material-ui/core';
import React, {
  useEffect, useRef, useCallback, useMemo,
} from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';

import RefreshIcon from '@material-ui/icons/Refresh';
import { useSnackbar } from 'notistack';
import useAxios from 'axios-hooks';

import { CreateUserReactionDto } from '@truepoint/shared/dist/dto/userReaction/createUserReaction.dto';
import { UserReaction as IUserReaction } from '@truepoint/shared/dist/interfaces/UserReaction.interface';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import CenterLoading from '../../../atoms/Loading/CenterLoading';
import UserReactionListItem from './sub/UserReactionListItem';

const useUserReactionStyle = makeStyles((theme: Theme) => createStyles({
  userReactionContainer: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(2),
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(2),
  },
  list: {
    maxHeight: theme.spacing(40),
    overflowY: 'auto',
    borderTop: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  form: {
    width: '100%',
    padding: theme.spacing(2, 0),
    '& input': {
      padding: theme.spacing(1.5, 2),
    },
  },
  formRow: {
    marginBottom: theme.spacing(0.8),
    '&>*': {
      marginRight: theme.spacing(0.6),
    },
  },
}));

export default function UserReactionCard(): JSX.Element {
  const classes = useUserReactionStyle();
  const { enqueueSnackbar } = useSnackbar();
  const formRef = useRef<HTMLFormElement>(null);
  const listContainerRef = useRef<HTMLUListElement>(null);
  const userReactionUrl = useRef<string>('/user-reactions');
  const defaultUsername = useRef<string>('시청자');
  const [{
    data: userReactionData,
    loading,
  }, getUserReactions] = useAxios<IUserReaction[]>(userReactionUrl.current, { manual: true });
  const [, postUserReaction] = useAxios<IUserReaction>({
    url: userReactionUrl.current,
    method: 'post',
  }, { manual: true });

  // api요청 핸들러
  const loadUserReactions = useCallback(() => {
    getUserReactions().then((res) => {
      if (listContainerRef.current && listContainerRef.current.scrollTop !== 0) {
        listContainerRef.current.scrollTop = 0; // 새로운 데이터 로드 후 ul스크롤 위치를 최상단으로
      }
    }).catch((e) => {
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

  // 등록버튼 클릭 | 인풋창에서 엔터 누를 시 실행되는 핸들러
  const handleSubmit = useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formRef.current) {
      return;
    }
    if (formRef.current.content.value === '') {
      ShowSnack('내용을 입력해주세요', 'error', enqueueSnackbar);
      return;
    }
    createUserReaction({
      username: formRef.current.username.value || defaultUsername.current,
      content: formRef.current.content.value,
    });
  }, [createUserReaction, enqueueSnackbar]);

  // 컴포넌트들
  const listComponent = useMemo(() => (
    <List className={classes.list} ref={listContainerRef}>
      {loading && <CenterLoading />}
      { userReactionData && userReactionData.length !== 0
      /* 데이터가 있는 경우 */
        ? userReactionData.map((data) => (
          <UserReactionListItem key={data.id} data={data} />
        ))
      /* 데이터가 없는 경우 */
        : <ListItem>데이터가 없습니다</ListItem>}
    </List>
  ), [classes.list, loading, userReactionData]);

  const formComponent = useMemo(() => (
    <form className={classes.form} onSubmit={handleSubmit} ref={formRef}>
      <div className={classes.formRow}>
        <TextField
          name="username"
          placeholder="사용자명"
          inputProps={{ maxLength: 8 }}
          variant="outlined"
        />
        <Button type="submit" size="large" variant="contained" color="primary">
          등록
        </Button>
      </div>
      <TextField
        name="content"
        placeholder="여러분들의 의견을 올려주세요"
        inputProps={{ maxLength: 50 }}
        variant="outlined"
        fullWidth
      />
    </form>
  ), [classes.form, classes.formRow, handleSubmit]);

  return (
    <section className={classes.userReactionContainer}>
      <header className={classes.header}>
        <Typography variant="h6">핫 시청자 반응</Typography>
        <Button variant="outlined" onClick={loadUserReactions}>
          <RefreshIcon />
          새로고침
        </Button>
      </header>
      {listComponent}
      {formComponent}
    </section>

  );
}
