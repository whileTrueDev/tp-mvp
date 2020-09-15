import React from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { Typography, Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useAxios from 'axios-hooks';
import CenterLoading from '../../../atoms/Loading/CenterLoading';
import LoginHelper from '../../../atoms/LoginHelper';
import useIamportCertification from '../../../utils/hooks/useIamportCertification';
import TruepointLogo from '../../../atoms/TruepointLogo';

const useStyles = makeStyles((theme) => ({
  box: {
    padding: `${theme.spacing(8)}px ${theme.spacing(4)}px`,
    minWidth: 300,
    maxWidth: 500,
    border: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  subcontent: { marginTop: theme.spacing(2) },
  content: { width: '100%', marginTop: theme.spacing(4), },
  selectButton: { width: '100%', padding: 16, borderBottom: `1px solid ${theme.palette.divider}`, },
  fullButton: {
    padding: theme.spacing(2), marginTop: theme.spacing(2), width: '100%'
  },
  inputField: { width: '100%' },
  helper: { marginTop: 32, minWidth: 300, maxWidth: 500, },
}));

export default function FindAccountForm(): JSX.Element {
  const classes = useStyles();
  // **************************************************
  // 스텝 할당을 위한 스테이트
  const [activeStep, setActiveStep] = React.useState(0);
  function handleNext() {
    setActiveStep((prev) => prev + 1);
  }
  // 에러 알림창 렌더링을 위한 스테이트
  const [helperText, setHelperOpen] = React.useState<string>();
  function handleHelperOpen(errorMessage:string):void { setHelperOpen(errorMessage); }
  function handleHelperClose():void { setHelperOpen(undefined); }

  // **************************************************
  // Request auth/certification
  const [certificateRequest, doGetRequest] = useAxios(
    '/auth/certification', { manual: true }
  );

  // Check registed user
  const [, checkIdRequest] = useAxios(
    '/users/check-id', { manual: true }
  );

  // **************************************************
  // iamport 본인인증 
  const [userDIState, setUserDI] = React.useState<string>();
  const iamport = useIamportCertification((impUid) => {
    // iamport 본인인증 이후 실행될 new password 조회 함수
    handleHelperClose();
    doGetRequest({ params: { impUid } })
      .then((res) => {
        if (res.data) {
          // user 고유 아이디
          const { userDI } = res.data;
          checkIdRequest({
            params: { userDI }
          }).then((inres) => {
            if (inres.data) {
              setUserDI(userDI);
              handleNext();
            } else {
              handleHelperOpen('본인인증된 정보로 가입된 계정이 존재하지 않습니다.');
            }
          });
        } else {
          // im-port에서 본인인증 정보를 가져오지 못하는 경우,
          handleHelperOpen('본인인증 정보를 불러오는 도중에 오류가 발생했습니다.\nsupport@mytruepoint.com으로 문의바랍니다.');
        }
      })
      .catch(() => {
        // 본인인증 DI 요청에서 400 에러인 경우 = 본인 인증한 유저 정보가 DB에 없는 경우
        handleHelperOpen('본인인증 정보를 불러오는 도중에 오류가 발생했습니다.\nsupport@mytruepoint.com으로 문의바랍니다.');
      });
  });

  // **************************************************
  // Request users/pw
  const passwordRef = React.useRef<HTMLInputElement>(null);
  const passwordConfirmRef = React.useRef<HTMLInputElement>(null);
  const [changePWRequest, doChangePWRequest] = useAxios({
    url: '/users/password', method: 'PATCH',
  }, { manual: true });
  // **************************************************
  // Handle change pw request
  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (passwordRef.current && passwordConfirmRef.current) {
      const pw = passwordRef.current.value;
      const confirmPw = passwordConfirmRef.current.value;
      if (pw === confirmPw) {
        doChangePWRequest({
          data: { userDI: userDIState, password: pw }
        }).then((res) => {
          if (res.data) {
            handleNext();
          } else {
            handleHelperOpen('본인인증된 정보로 가입된 계정이 존재하지 않습니다.');
          }
        }).catch(() => {
          handleHelperOpen('비밀번호를 변경하는 도중에 오류가 발생했습니다.\nsupport@mytruepoint.com으로 문의바랍니다.');
        });
      } else {
        handleHelperOpen('비밀번호가 일치하지 않습니다.\n비밀번호를 올바르게 입력해주시기 바랍니다.');
      }
    }
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <TruepointLogo />

      {helperText && (
        <div className={classes.helper}>
          <LoginHelper text={helperText} />
        </div>
      )}

      {/* 본인 인증 */}
      {activeStep === 0 && (
      <div className={classnames(classes.box, classes.content)}>
        <Typography variant="h6">휴대폰 본인인증을 통해</Typography>
        <Typography variant="h6">트루포인트 비밀번호를 찾습니다.</Typography>
        <div className={classes.content}>
          <Button
            variant="contained"
            color="secondary"
            className={classes.fullButton}
            style={{ color: 'white' }}
            onClick={() => { iamport.startCert(); }}
            disabled={certificateRequest.loading}
          >
            <Typography>휴대폰 본인인증</Typography>
          </Button>
        </div>
      </div>
      )}

      {/* 변경된 비밀번호 정보 렌더링 */}
      {activeStep === 1 && (
      <div className={classnames(classes.box, classes.content)}>
        <Typography variant="h6">본인인증이 완료되었습니다.</Typography>
        <Typography variant="h6">새롭게 설정할 비밀번호를 입력해주세요.</Typography>
        <Typography className={classes.subcontent} variant="body2">비밀번호는 8자 이상 16자 이하입니다.</Typography>

        <form className={classes.content} onSubmit={handleSubmit}>
          <TextField
            color="secondary"
            type="password"
            label="비밀번호"
            inputRef={passwordRef}
            autoComplete="off"
            className={classes.inputField}
            inputProps={{ required: true, minLength: 8 }}
          />
          <TextField
            color="secondary"
            type="password"
            label="비밀번호 확인"
            inputRef={passwordConfirmRef}
            autoComplete="off"
            className={classes.inputField}
            inputProps={{ required: true, }}
          />
          <Button
            variant="contained"
            color="secondary"
            className={classes.fullButton}
            style={{ color: 'white' }}
            disabled={activeStep === 1 && changePWRequest.loading}
            type="submit"
          >
            <Typography>비밀번호 변경하기</Typography>
          </Button>
        </form>
      </div>
      )}

      {activeStep === 2 && (
      <div className={classnames(classes.box, classes.content)}>
        <Typography variant="h6">비밀번호 변경이 완료되었습니다.</Typography>
        <Typography variant="h6">변경한 비밀번호로 로그인해주세요.</Typography>
        <div className={classes.content}>
          <Button
            variant="contained"
            color="secondary"
            className={classes.fullButton}
            style={{ color: 'white' }}
            component={Link}
            to="/login"
          >
            <Typography>로그인 하러 가기</Typography>
          </Button>
        </div>
      </div>
      )}

      <div style={{ marginTop: 16 }}>
        <Button component={Link} to="/login">로그인 하러 가기</Button>
      </div>

      {/* 데이터 불러오는 중 로딩 컴포넌트 */}
      {((activeStep === 0 && certificateRequest.loading)
        || (activeStep === 1 && changePWRequest.loading
        )) && (<CenterLoading position="relative" />)}
    </div>
  );
}
