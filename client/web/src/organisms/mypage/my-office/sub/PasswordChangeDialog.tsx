import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, makeStyles, Typography,
} from '@material-ui/core';
import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import PasswordTextField from '../../../../atoms/Input/PasswordTextField';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';
import useAuthContext from '../../../../utils/hooks/useAuthContext';

const useStyles = makeStyles((theme) => ({
  titleSection: { padding: `${theme.spacing(2)}px ${theme.spacing(3)}px` },
  bold: { fontWeight: 'bold' },
}));
export interface PasswordChangeDialogProps {
  open: boolean;
  onClose: () => void;
}
export default function PasswordChangeDialog({
  open,
  onClose,
}: PasswordChangeDialogProps): JSX.Element {
  const classes = useStyles();
  const auth = useAuthContext();
  const { enqueueSnackbar } = useSnackbar();

  // ********************************************
  // 패스워드 수정 스테퍼 스텝 스테이트
  const [activeStep, setActiveStep] = useState(0);
  function handleNext() {
    setActiveStep((prev) => prev + 1);
  }
  function handleStepReset() {
    setActiveStep(0);
  }

  // ********************************************
  // 기존 비밀번호 체크
  // 패스워드 문자열 스테이트
  const [currentPw, setCurrentPw] = React.useState<string>('');
  function handleCurrentPwChange(e: React.ChangeEvent<HTMLInputElement>) {
    setCurrentPw(e.target.value);
  }
  // 패스워드 체크 요청
  const [checkPwObject, checkPwRequest] = useAxios({
    url: '/auth/check-pw', method: 'post',
  }, { manual: true });

  // 비밀번호 확인 form 핸들러
  function handlePasswordCheckSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    checkPwRequest({
      data: { password: currentPw },
    }).then(() => {
      handleNext();
    }).catch(() => {
      ShowSnack('비밀번호가 일치하지 않습니다.', 'error', enqueueSnackbar);
    });
  }

  // ********************************************
  // 새로운 비밀번호
  const [newPw, setNewPw] = React.useState<string>('');
  function handleNewPwChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewPw(e.target.value);
  }
  // 새로운 비밀번호 확인
  const [newPwCheck, setNewPwCheck] = React.useState<string>('');
  function handleNewPwCheckChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNewPwCheck(e.target.value);
  }
  // 비밀번호 변경 요청
  const [newPasswordObject, newPasswordRequest] = useAxios({
    method: 'patch', url: '/users/password',
  }, { manual: true });

  // 비밀번호 변경 form 핸들러
  function handleNewPasswordSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    newPasswordRequest({
      data: { userDI: auth.user.userDI, password: newPw },
    })
      .then(() => {
        ShowSnack('비밀번호가 성공적으로 변경되었습니다.', 'success', enqueueSnackbar);
        allReset();
        onClose();
      })
      .catch(() => {
        ShowSnack('비밀번호 변경 중 오류가 발생했습니다. 문의 부탁드립니다.', 'error', enqueueSnackbar);
        allReset();
        onClose();
      });
  }

  // ********************************************
  // 다이얼로그 Close 이전 All Reset
  function allReset() {
    handleStepReset();
    setNewPwCheck('');
    setNewPw('');
    setCurrentPw('');
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      {/* 기존 비밀번호 확인 */}
      {activeStep === 0 && (
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
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            disabled={checkPwObject.loading}
            variant="contained"
            onClick={() => {
              onClose(); allReset();
            }}
          >
            취소
          </Button>
          <Button variant="contained" color="primary" type="submit">다음</Button>
        </DialogActions>
      </form>
      )}

      {/* 비밀번호 변경 */}
      {activeStep === 1 && (
      <form onSubmit={handleNewPasswordSubmit}>
        <DialogTitle>
          <Typography variant="h6" className={classes.bold}>비밀번호 변경</Typography>
          <Typography variant="body2">변경할 비밀번호를 입력해주세요.</Typography>
          <Typography color="textSecondary" variant="body2">*비밀번호는 특수문자를 포함한 8-20자 영문 또는 숫자만 가능합니다.</Typography>
        </DialogTitle>

        <DialogContent>
          <PasswordTextField
            variant="filled"
            label="변경 비밀번호"
            margin="dense"
            id="edit-password"
            autoFocus
            fullWidth
            value={newPw}
            onChange={handleNewPwChange}
            helperText="특수문자를 포함한 8-20자 영문 또는 숫자만 가능합니다."
          />
          <PasswordTextField
            variant="filled"
            label="변경 비밀번호 확인"
            margin="dense"
            id="confirm-password"
            fullWidth
            value={newPwCheck}
            onChange={handleNewPwCheckChange}
            error={Boolean(newPwCheck) && !(newPwCheck === newPw)}
            helperText={!(newPwCheck === newPw) ? '비밀번호와 동일하지 않습니다.' : null}
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            disabled={newPasswordObject.loading}
            onClick={() => {
              onClose(); allReset();
            }}
          >
            취소
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!(newPwCheck === newPw) || !newPw}
            type="submit"
          >
            변경
          </Button>
        </DialogActions>
      </form>
      )}
    </Dialog>
  );
}
