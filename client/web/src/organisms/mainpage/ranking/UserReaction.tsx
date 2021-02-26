import {
  Avatar,
  Button,
  Grid,
  List, ListItem, ListItemAvatar, ListItemText, TextField, Typography,
} from '@material-ui/core';
import React, {
  useEffect, useState, useRef,
} from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import * as datefns from 'date-fns';
import RefreshIcon from '@material-ui/icons/Refresh';
import { useSnackbar } from 'notistack';
import useAxios from 'axios-hooks';
import transformIdToAsterisk from '../../../utils/transformAsterisk';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';

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
  title: {},
  list: {
    maxHeight: theme.spacing(40),
    overflowY: 'scroll',
    borderTop: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  itemPrimaryText: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
    '&>span': {
      color: theme.palette.grey[600],
    },
  },
  form: {
    width: '100%',
    padding: theme.spacing(2, 0),
    '& input': {
      padding: theme.spacing(1.5, 2),
    },
    '&>*+*': {
      marginTop: theme.spacing(0.5),
    },
  },
  nicknameInput: {
    width: theme.spacing(18),
    marginRight: theme.spacing(0.5),
  },
}));

interface CreateUserReactionDto{
  nickname: string;
  content: string;
}

export interface UserReactionData {
  id: number;
  username: string;
  ip: string;
  createDate: Date;
  content: string;
}
function createUserReactionData(count = 10) {
  const result: UserReactionData[] = [];
  for (let i = 0; i < count; i += 1) {
    result.push({
      id: i,
      username: `시청자${i}`,
      ip: `${Math.floor(Math.random() * 255) + 1}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      createDate: new Date(),
      // content: `시청자 반응${i}입니다. 시청자반응은 50자 이내로 댓글 시청자 반응 핫한 반응 순서대로 올`,
      content: `시청자 반응${i}입니다. `,
    });
  }
  return result;
}
export default function UserReaction(): JSX.Element {
  const classes = useUserReactionStyle();
  const [userReactionData, setUserReactionData] = useState<UserReactionData[]>([]);
  const [,
    // {data:userReactionData, loading}
    getUserReactions] = useAxios<UserReactionData[]>('url', { manual: true });
  const [, postUserReaction] = useAxios({
    url: 'url',
    method: 'post',
  }, { manual: true });
  const formRef = useRef<HTMLFormElement>(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setUserReactionData(createUserReactionData());
  }, []);

  const loadUserReactions = () => {
    getUserReactions().then((res) => {
      // console.log(res);
    }).catch((e) => {
      console.error('시청자 반응 데이터 불러오기 오류', e);
    });
  };

  const createUserReaction = (createUserReactionDto: CreateUserReactionDto) => {
    postUserReaction({
      data: createUserReactionDto,
    }).then((res) => {
      // console.log(res);
      loadUserReactions();
    }).catch((err) => {
      console.error('시청자 반응 생성 에러', err);
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // console.log('submit');
    if (!formRef.current) {
      return;
    }
    if (formRef.current.nickname.value === '') {
      ShowSnack('닉네임을 입력해주세요', 'error', enqueueSnackbar);
      return;
    }
    if (formRef.current.content.value === '') {
      ShowSnack('내용을 입력해주세요', 'error', enqueueSnackbar);
    }
    createUserReaction({
      nickname: formRef.current.nickname.value,
      content: formRef.current.content.value,
    });
  };
  return (
    <section className={classes.userReactionContainer}>
      <header className={classes.header}>
        <Typography variant="h6" className={classes.title}>핫 시청자 반응</Typography>
        <Button variant="outlined" onClick={loadUserReactions}>
          <RefreshIcon />
          새로고침
        </Button>
      </header>
      <List className={classes.list}>
        {userReactionData.map((data) => (
          <ListItem key={data.id} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar />
            </ListItemAvatar>
            <ListItemText
              classes={{
                primary: classes.itemPrimaryText,
              }}
              primary={(
                <>
                  <Typography>{`${data.username} (${transformIdToAsterisk(data.ip, 2)})`}</Typography>
                  <Typography variant="caption" component="span">{datefns.format(data.createDate, 'hh:MM aaaaa\'m\'')}</Typography>
                </>
              )}
              secondary={
                <Typography>{data.content}</Typography>
              }
            />
          </ListItem>
        ))}
      </List>
      <form className={classes.form} onSubmit={handleSubmit} ref={formRef}>
        <Grid container alignItems="center">
          <TextField
            className={classes.nicknameInput}
            name="nickname"
            placeholder="닉네임"
            inputProps={{ maxLength: 8 }}
            variant="outlined"
          />
          <Button type="submit" size="large" variant="contained" color="primary">등록</Button>
        </Grid>

        <TextField
          name="content"
          placeholder="여러분들의 의견을 올려주세요"
          inputProps={{ maxLength: 50 }}
          variant="outlined"
          fullWidth
        />

      </form>
    </section>

  );
}
