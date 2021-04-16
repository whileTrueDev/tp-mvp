import { Button, TextField } from '@material-ui/core';
import React from 'react';
import useAuthContext from '../../../../utils/hooks/useAuthContext';
import { useCreatorCommentFormStyle } from '../style/CreatorComment.style';

export interface CommentFormProps {
  submitHandler: (e: React.FormEvent<HTMLFormElement>) => void
}

export default function CommentForm(props: CommentFormProps): JSX.Element {
  const { submitHandler } = props;
  const authContext = useAuthContext();
  const formStyle = useCreatorCommentFormStyle();
  return (
    <form className={formStyle.form} onSubmit={submitHandler}>
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
        {authContext.user.userId
          ? null
          : <TextField label="비밀번호" name="password" type="password" placeholder="비밀번호" variant="outlined" inputProps={{ maxLength: 4 }} />}
      </div>
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
