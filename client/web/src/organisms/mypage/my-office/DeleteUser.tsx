import classnames from 'classnames';
import {
  Button, Checkbox, Dialog, DialogActions, DialogContent, Divider, FormControlLabel, makeStyles, Typography,
} from '@material-ui/core';
import React, { useState } from 'react';
import { Alert } from '@material-ui/lab';
import useAxios from 'axios-hooks';
import { useHistory } from 'react-router-dom';
import useDialog from '../../../utils/hooks/useDialog';
import PasswordConfirmForm from './sub/PasswordConfirmForm';
import useAuthContext from '../../../utils/hooks/useAuthContext';

const useStyles = makeStyles((theme) => ({
  container: { margin: theme.spacing(2), textAlign: 'right' },
  link: {
    cursor: 'pointer',
    '&:hover': { textDecoration: 'underline' },
  },
  center: { margin: `${theme.spacing(2)}px 0px`, textAlign: 'center' },
  bold: { fontWeight: 'bold' },
  bottomSpace: { marginBottom: theme.spacing(1) },
  titleSection: { padding: `${theme.spacing(2)}px ${theme.spacing(3)}px` },
  alertBox: {
    margin: `${theme.spacing(2)}px 0px`,
    textAlign: 'center',
    minWidth: '100%',
  },
}));
export default function DeleteUser(): JSX.Element {
  const classes = useStyles();
  const confirmDialog = useDialog();

  // *********************************
  // 탈퇴 동의 체크 박스 스테이트
  const [confirmCheck, setConfirmCheck] = useState<boolean>(false);
  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setConfirmCheck(event.target.checked);
  }
  function handleCheckReset() {
    setConfirmCheck(false);
  }

  // *********************************
  // 탈퇴 단계를 위한 스테이트
  const [activeStep, setActiveStep] = useState<number>(0);
  function handleNext() {
    setActiveStep((prev) => prev + 1);
  }
  function handleStepReset() {
    setActiveStep(0);
  }

  // *********************************
  // 다이얼로그 꺼질때 스테이트 초기화 함수
  function handleDialogClose() {
    confirmDialog.handleClose();
    handleCheckReset();
    handleStepReset();
  }

  // *********************************
  // 회원 탈퇴 요청
  const history = useHistory();
  const [, userDeleteRequest] = useAxios({
    url: 'users', method: 'delete',
  }, { manual: true });

  // *********************************
  // 로그아웃 을 위해
  const auth = useAuthContext();

  return (
    <div className={classes.container}>
      <Typography
        onClick={confirmDialog.handleOpen}
        className={classes.link}
        variant="caption"
        color="textSecondary"
      >
        회원 탈퇴
      </Typography>

      {/* 회원 탈퇴 확인 다이얼로그 */}
      <Dialog
        open={confirmDialog.open}
        onClose={handleDialogClose}
        maxWidth="sm"
        fullWidth
        disableScrollLock
      >
        {activeStep === 0 && (
        <>
          <div className={classes.titleSection}>
            <Typography variant="h6">
              회원 탈퇴 확인
            </Typography>
          </div>
          <DialogContent>
            <div className={classes.center}>
              <Typography
                className={classnames(classes.bold, classes.bottomSpace)}
              >
                트루포인트는 지속적으로 기능을 개선하기 위해 노력합니다.
              </Typography>
              <Typography>1. 데이터 기반 유튜브 채널 분석</Typography>
              <Typography>2. 더욱 많은 편집점 포인트 제공</Typography>
              <Typography>3. 더욱 많은 방송별 지표 비교</Typography>
            </div>

            <Divider />

            <div className={classes.center}>
              <Alert severity="error">
                <Typography>탈퇴시, 구독 정보를 포함한 모든 데이터는 삭제되며, 다시 되돌릴 수 없습니다.</Typography>
              </Alert>
              <FormControlLabel
                control={<Checkbox color="primary" onChange={handleChange} checked={confirmCheck} />}
                label="이해했으며, 모든 데이터를 삭제하고 탈퇴하는 데에 동의합니다."
              />
            </div>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={confirmDialog.handleClose}>
              취소
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={!confirmCheck}
              onClick={handleNext}
            >
              탈퇴 진행
            </Button>
          </DialogActions>
        </>
        )}

        {activeStep === 1 && (
          <>
            <PasswordConfirmForm
              successCallback={() => {
                handleNext();
              }}
              onClose={() => {
                handleDialogClose();
              }}
            />
          </>
        )}

        {activeStep === 2 && (
          <div>
            <div className={classes.titleSection}>
              <Typography variant="h6">
                회원 탈퇴 확인
              </Typography>
            </div>
            <DialogContent>
              <Typography>정말로 탈퇴하시겠습니까?</Typography>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" color="default" onClick={handleDialogClose}>
                취소
              </Button>
              <Button
                variant="contained"
                color="default"
                onClick={() => userDeleteRequest()
                  .then(() => {
                    auth.handleLogout();
                    history.push('/');
                  })}
              >
                진행
              </Button>
            </DialogActions>
          </div>
        )}
      </Dialog>
    </div>
  );
}
