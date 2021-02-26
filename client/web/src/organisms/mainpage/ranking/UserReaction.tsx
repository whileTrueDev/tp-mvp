import {
  Avatar,
  Button,
  List, ListItem, ListItemAvatar, ListItemText, TextField, Typography,
} from '@material-ui/core';
import React, {
  useEffect, useRef,
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
  content: string;
}

export interface UserReactionData {
  id: number;
  username: string;
  ip: string;
  createDate: Date;
  content: string;
}

const userReactionUrl = '/user-reactions';
export default function UserReaction(): JSX.Element {
  const classes = useUserReactionStyle();
  // const [userReactionData, setUserReactionData] = useState<UserReactionData[]>([]);
  const [{
    data: userReactionData,
    //  loading 
  }, getUserReactions] = useAxios<UserReactionData[]>(userReactionUrl, { manual: true });
  const [, postUserReaction] = useAxios({
    url: userReactionUrl,
    method: 'post',
  }, { manual: true });
  const formRef = useRef<HTMLFormElement>(null);
  const { enqueueSnackbar } = useSnackbar();

  const loadUserReactions = () => {
    getUserReactions().then((res) => {
      // console.log(res);
    }).catch((e) => {
      console.error('시청자 반응 데이터 불러오기 오류', e);
    });
  };

  useEffect(() => {
    loadUserReactions();
  }, []);

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
    if (formRef.current.content.value === '') {
      ShowSnack('내용을 입력해주세요', 'error', enqueueSnackbar);
    }
    createUserReaction({
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
        { userReactionData && userReactionData.length !== 0
          ? userReactionData.map((data) => (
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
                    <Typography variant="caption" component="span">{datefns.format(new Date(data.createDate), 'hh:MM aaaaa\'m\'')}</Typography>
                  </>
              )}
                secondary={
                  <Typography>{data.content}</Typography>
              }
              />
            </ListItem>
          ))
          : <ListItem>데이터가 없습니다</ListItem>}
      </List>
      <form className={classes.form} onSubmit={handleSubmit} ref={formRef}>
        <TextField
          name="content"
          placeholder="여러분들의 의견을 올려주세요"
          inputProps={{ maxLength: 50 }}
          variant="outlined"
          fullWidth
        />
        <Button type="submit" size="large" variant="contained" color="primary">등록</Button>
      </form>
    </section>

  );
}
