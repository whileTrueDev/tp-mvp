import { Button, TextField } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import React, { useRef } from 'react';
import ShowSnack from './snackbar/ShowSnack';

const useCheckPasswordFormStyle = makeStyles((theme: Theme) => createStyles({
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    '&>*+*': {
      marginTop: theme.spacing(2),
    },
  },
  input: {
    textAlign: 'center',
    padding: theme.spacing(1),
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
}));

export interface CheckPasswordFormProps {
  closeDialog: () => void,
  checkPassword: (data?: any) => Promise<any>;
  successHandler: () => void,
  children?: React.ReactNode
}

export default function CheckPasswordForm({
  closeDialog,
  checkPassword,
  successHandler,
  children,
}: CheckPasswordFormProps): JSX.Element {
  const classes = useCheckPasswordFormStyle();
  const passwordRef = useRef<HTMLInputElement>(null);
  const { enqueueSnackbar } = useSnackbar();
  const handleCancel = () => {
    closeDialog();
  };

  const handleSubmitPassword = () => {
    if (passwordRef.current && passwordRef.current.value.trim() === '') {
      // 비밀번호가 빈칸인 경우
      ShowSnack('비밀번호를 입력해주세요.', 'error', enqueueSnackbar);
      passwordRef.current.focus();
      return;
    }

    checkPassword({
      password: passwordRef.current ? passwordRef.current.value : '',
    }).then((res) => {
      if (res.data === true) {
        successHandler();
        closeDialog();
        // 글수정인 경우 비밀번호 맞음 -> write/postId로 이동
        // 글삭제인 경우 -> 글 삭제
      } else {
        // 비밀번호 틀림 -> 스낵바
        ShowSnack('비밀번호가 틀렸습니다. 다시 시도해주세요', 'error', enqueueSnackbar);
      }
    }).catch((e) => {
      ShowSnack('비밀번호 확인 중 오류가 발생했습니다. 다시 시도해주세요', 'error', enqueueSnackbar);
      console.error(e);
    });
  };
  return (
    <form
      className={classes.form}
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      {children}
      <TextField
        margin="dense"
        variant="outlined"
        autoFocus
        type="password"
        className={classes.input}
        placeholder="비밀번호를 입력해주세요"
        inputRef={passwordRef}
        inputProps={{
          maxLength: 4,
        }}
        lang="en"
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmitPassword();
        }}
      />
      <div className={classes.buttonContainer}>
        <Button onClick={handleCancel}>취소</Button>
        <Button variant="contained" color="primary" onClick={handleSubmitPassword}>확인</Button>
      </div>
    </form>
  );
}
