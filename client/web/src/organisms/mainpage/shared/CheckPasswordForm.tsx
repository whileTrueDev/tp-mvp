import { Button } from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { AxiosPromise, AxiosRequestConfig } from 'axios';
import { RefetchOptions } from 'axios-hooks';
import { useSnackbar } from 'notistack';
import React, { useRef } from 'react';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';

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
    justifyContent: 'space-between',
  },
}));

export default function CheckPasswordForm({
  closeDialog,
  checkPassword,
  successHandler,
  children,
}: {
  closeDialog: () => void,
  checkPassword: (config?: AxiosRequestConfig | undefined, options?: RefetchOptions | undefined) => AxiosPromise<any>;
  successHandler: () => void,
  children?: JSX.Element| JSX.Element[]
}): JSX.Element {
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
      data: { password: passwordRef.current ? passwordRef.current.value : '' },
    }).then((res) => {
      if (res.data === true) {
        successHandler();
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
      <input
        // eslint-disable-next-line jsx-a11y/no-autofocus
        autoFocus
        type="password"
        className={classes.input}
        ref={passwordRef}
        placeholder="비밀번호를 입력해주세요"
        maxLength={4}
        lang="en"
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSubmitPassword();
        }}
      />
      <div className={classes.buttonContainer}>
        <Button variant="contained" onClick={handleCancel}>취소</Button>
        <Button variant="contained" color="primary" onClick={handleSubmitPassword}>입력</Button>
      </div>
    </form>
  );
}
