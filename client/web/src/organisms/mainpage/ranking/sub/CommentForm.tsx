import {
  Button, Grid, InputBase, TextField, Typography,
} from '@material-ui/core';
import { CreateCommentDto } from '@truepoint/shared/dist/dto/creatorComment/createComment.dto';
import { useSnackbar } from 'notistack';
import React from 'react';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';
import axios from '../../../../utils/axios';
import useAuthContext from '../../../../utils/hooks/useAuthContext';
import useMediaSize from '../../../../utils/hooks/useMediaSize';
import { useCreatorCommentFormStyle } from '../style/CreatorComment.style';

export interface CommentFormProps {
  /** */
  postUrl: string;
  callback?: () => void;
}

/**
 * 댓글 작성 폼 컴포넌트
 * props로 댓글 생성 요청 url과
 * 댓글 생성 후 실행할 callback함수를 받는다
 * @param props 
 * @returns 
 */
export default function CommentForm(props: CommentFormProps): JSX.Element {
  const { postUrl = '', callback } = props;
  const authContext = useAuthContext();
  const { isMobile } = useMediaSize();
  const { enqueueSnackbar } = useSnackbar();
  const formStyle = useCreatorCommentFormStyle();

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const nicknameInput = form.nickname;
    const passwordInput = form.password;
    const contentInput = form.content;

    const createCommentDto: CreateCommentDto = {
      userId: authContext.user.userId ? authContext.user.userId : null,
      nickname: '',
      password: '',
      content: '',
    };

    if (authContext.user.userId) { // 로그인 된 상태일 경우
      const nickname = authContext.user.nickName;
      const content = e.currentTarget.content.value.trim();
      if (!nickname || !content) {
        ShowSnack('닉네임, 내용을 입력해주세요', 'error', enqueueSnackbar);
        return;
      }
      createCommentDto.nickname = nickname;
      createCommentDto.content = content;
    } else { // 비로그인 상태일 경우
      const nickname = e.currentTarget.nickname.value.trim();
      const password = e.currentTarget.password.value.trim();
      const content = e.currentTarget.content.value.trim();
      if (!nickname || !password || !content) {
        ShowSnack('닉네임, 비밀번호, 내용을 입력해주세요', 'error', enqueueSnackbar);
        return;
      }
      createCommentDto.nickname = nickname;
      createCommentDto.password = password;
      createCommentDto.content = content;
    }

    axios.post(postUrl, { ...createCommentDto })
      .then((res) => {
        if (!authContext.user.userName) {
          nicknameInput.value = '';
          passwordInput.value = '';
        }
        contentInput.value = '';

        if (callback) {
          callback();
        }
      })
      .catch((error) => console.error(error));
  };
  return (
    <form className={formStyle.form} onSubmit={onSubmit}>
      {/* 로그인 한 경우 */}
      {authContext.user.userId && authContext.accessToken && (
        <Typography>{authContext.user.nickName}</Typography>
      )}
      {/* 로그인 안하고 모바일 화면인 경우 */}
      {(!authContext.user.userId && !authContext.accessToken) && isMobile && (
        <Grid container>
          <Grid item xs={6}>
            <TextField
              label="닉네임"
              name="nickname"
              variant="outlined"
              placeholder="닉네임"
              inputProps={{ maxLength: 8 }}
              className={formStyle.nicknameInput}
              defaultValue={authContext.user.userName}
              size="small"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="비밀번호"
              name="password"
              type="password"
              placeholder="비밀번호"
              variant="outlined"
              className={formStyle.passwordInput}
              inputProps={{ maxLength: 4 }}
              autoComplete="on"
              size="small"
            />
          </Grid>
        </Grid>
      )}
      {/* 로그인 안하고 데스크탑 화면인 경우 */}
      {(!authContext.user.userId && !authContext.accessToken) && !isMobile && (
      <div>
        <TextField
          label="닉네임"
          name="nickname"
          variant="outlined"
          placeholder="닉네임"
          inputProps={{ maxLength: 8 }}
          className={formStyle.nicknameInput}
          defaultValue={authContext.user.userName}
          size="small"
        />
        <TextField
          label="비밀번호"
          name="password"
          type="password"
          placeholder="비밀번호"
          variant="outlined"
          className={formStyle.passwordInput}
          inputProps={{ maxLength: 4 }}
          autoComplete="on"
          size="small"
        />
      </div>
      )}
      <InputBase
        className={formStyle.contentTextArea}
        fullWidth
        multiline
        rows={2}
        inputProps={{ maxLength: 240 }}
        name="content"
        placeholder="댓글을 입력해주세요"
      />
      <div className={formStyle.buttonWrapper}>
        <Button size="small" type="submit" className={formStyle.button}>등록</Button>
      </div>
    </form>
  );
}
