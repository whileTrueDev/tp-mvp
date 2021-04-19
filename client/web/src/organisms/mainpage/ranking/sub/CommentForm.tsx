import { Button, TextField, Typography } from '@material-ui/core';
import { CreateCommentDto } from '@truepoint/shared/dist/dto/creatorComment/createComment.dto';
import { useSnackbar } from 'notistack';
import React from 'react';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';
import useAuthContext from '../../../../utils/hooks/useAuthContext';
import { useCreatorCommentFormStyle } from '../style/CreatorComment.style';
import axios from '../../../../utils/axios';

export interface CommentFormProps {
  /** 댓글 생성하는 라우터 url */
  postUrl: string,
  /** 댓글 생성 post요청 성공 후 실행 할 콜백함수(다시 댓글목록 불러오는 함수 등) */
  submitSuccessCallback?: () => void
}

export default function CommentForm(props: CommentFormProps): JSX.Element {
  const { submitSuccessCallback, postUrl } = props;
  const authContext = useAuthContext();
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
        if (submitSuccessCallback) {
          submitSuccessCallback();
        }
      })
      .catch((error) => console.error(error));
  };
  return (
    <form className={formStyle.form} onSubmit={onSubmit}>
      {authContext.user.userId
        ? (
          <Typography>{authContext.user.nickName}</Typography>
        )
        : (
          <div>
            <TextField
              label="닉네임"
              name="nickname"
              variant="outlined"
              placeholder="닉네임"
              inputProps={{ maxLength: 8 }}
              className={formStyle.nicknameInput}
              defaultValue={authContext.user.userName}
            />
            <TextField label="비밀번호" name="password" type="password" placeholder="비밀번호" variant="outlined" inputProps={{ maxLength: 4 }} autoComplete="on" />
          </div>
        )}
      <TextField
        className={formStyle.contentTextArea}
        fullWidth
        multiline
        rows={4}
        inputProps={{ maxLength: 240 }}
        name="content"
        placeholder="내용을 입력해주세요"
      />
      <div className={formStyle.buttonWrapper}>
        <Button type="submit" className={formStyle.button}>등록</Button>
      </div>
    </form>
  );
}
