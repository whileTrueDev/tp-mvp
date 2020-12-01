import {
  Button, CircularProgress, DialogActions, DialogContent, makeStyles, Typography,
} from '@material-ui/core';
import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';
import React from 'react';
import PasswordTextField from '../../../../atoms/Input/PasswordTextField';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';

const useStyles = makeStyles((theme) => ({
  titleSection: { padding: `${theme.spacing(2)}px ${theme.spacing(3)}px` },
  bold: { fontWeight: 'bold' },
}));
export interface PasswordConfirmFormProps {
  successCallback: () => any;
  onClose: () => any;
}
export default function PasswordConfirmForm({
  successCallback, onClose,
}: PasswordConfirmFormProps): JSX.Element {
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  // ********************************************
  // 기존 비밀번호 체크

  // 비밀번호가 틀린 경우 에러메시지를 표시하기 위한 스테이트
  const [currentPwErrMsg, setCurrentPwErrMsg] = React.useState<string>('');
  function handleErrMsg() { // 비밀번호 틀림 에러 도움말
    setCurrentPwErrMsg('비밀번호가 일치하지 않습니다.');
  }
  function handleErrMsgReset() { // 비밀번호 틀림 에러 도움말 제거
    setCurrentPwErrMsg('');
  }

  // 패스워드 문자열 스테이트
  const [currentPw, setCurrentPw] = React.useState<string>('');
  function handleCurrentPwChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCurrentPw(e.target.value);
    if (currentPwErrMsg) handleErrMsgReset(); // 패스워드를 쓰기 시작하면 기존 에러메시지 제거
  }
  // 패스워드 체크 요청
  const [checkPwObject, checkPwRequest] = useAxios({
    url: '/auth/check-pw', method: 'post',
  }, { manual: true });

  // 비밀번호 확인 form 핸들러
  function handlePasswordCheckSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    checkPwRequest({ data: { password: currentPw } })
      .then(() => {
        setCurrentPw('');
        successCallback();
      })
      .catch((err) => {
        if (err.response && err.response.status === 403) handleErrMsg();
        setCurrentPw('');
        ShowSnack('비밀번호가 일치하지 않습니다.', 'error', enqueueSnackbar);
      });
  }

  return (
    <form onSubmit={handlePasswordCheckSubmit}>
      <div className={classes.titleSection}>
        <Typography variant="h6" className={classes.bold}>비밀번호 확인</Typography>
        <Typography variant="body2">보안을 위해 비밀번호를 입력하고 계속 진행하세요.</Typography>
      </div>
      <DialogContent>
        <PasswordTextField
          variant="filled"
          label="비밀번호"
          autoFocus
          margin="dense"
          id="password"
          value={currentPw}
          onChange={handleCurrentPwChange}
          error={!!currentPwErrMsg}
          helperText={currentPwErrMsg}
          fullWidth
        />
        {checkPwObject.loading && (
        <CircularProgress />
        )}
      </DialogContent>
      <DialogActions>
        <Button
          disabled={checkPwObject.loading}
          variant="contained"
          onClick={() => {
            onClose();
          }}
        >
          취소
        </Button>
        <Button variant="contained" color="primary" type="submit">다음</Button>
      </DialogActions>
    </form>
  );
}
