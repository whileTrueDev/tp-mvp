import {
  Button, Dialog, DialogActions, DialogContent, makeStyles, Typography,
} from '@material-ui/core';
import { useSnackbar } from 'notistack';
import React, { useState } from 'react';
import PasswordTextField from '../../../../atoms/Input/PasswordTextField';
import ShowSnack from '../../../../atoms/snackbar/ShowSnack';
import { useMutatePassword } from '../../../../utils/hooks/mutation/useMutateUserInfo';
import useAuthContext from '../../../../utils/hooks/useAuthContext';
import PasswordConfirmForm from './PasswordConfirmForm';

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
  // 비밀번호 값 스테이트 관련

  // 비밀번호 벨리데이션 체크 함수
  function checkPwValidate(pw: string) {
    const passwordRegx = /^(?=.*[a-zA-Z0-9]).{8,20}$/;
    return passwordRegx.test(pw);
  }

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
  const { mutateAsync: newPasswordRequest, isLoading: loading } = useMutatePassword();
  // 비밀번호 변경 form 핸들러
  function handleNewPasswordSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    newPasswordRequest({ userDI: auth.user.userDI, password: newPw })
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
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" disableScrollLock>
      {/* 기존 비밀번호 확인 */}
      {activeStep === 0 && (
        <PasswordConfirmForm
          successCallback={handleNext}
          onClose={() => {
            onClose(); allReset();
          }}
        />
      )}

      {/* 비밀번호 변경 */}
      {activeStep === 1 && (
      <form onSubmit={handleNewPasswordSubmit}>
        <div className={classes.titleSection}>
          <Typography variant="h6" className={classes.bold}>비밀번호 변경</Typography>
          <Typography variant="body2">변경할 비밀번호를 입력해주세요.</Typography>
          <Typography color="textSecondary" variant="body2">*비밀번호는 8-20자 영문 또는 숫자만 가능합니다.</Typography>
        </div>

        <DialogContent>
          <PasswordTextField
            variant="outlined"
            label="변경 비밀번호"
            margin="dense"
            id="edit-password"
            autoFocus
            fullWidth
            value={newPw}
            onChange={handleNewPwChange}
            error={!checkPwValidate(newPw)}
            helperText="8-20자 영문 또는 숫자만 가능합니다."
          />
          <PasswordTextField
            variant="outlined"
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
            disabled={loading}
            onClick={() => {
              onClose(); allReset();
            }}
          >
            취소
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!(newPwCheck === newPw) || !newPw || !checkPwValidate(newPw)}
            // 비번/비번확인이 같지않거나, 비번이 없거나, validation 통과 못한경우
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
