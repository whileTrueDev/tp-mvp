import React from 'react';
import useAxios from 'axios-hooks';
import { Link } from 'react-router-dom';
import { Typography, Button } from '@material-ui/core';
import useIamportCertification from '../../../utils/hooks/useIamportCertification';
import LoginHelper from '../../../atoms/LoginHelper';
// import { makeStyles } from '@material-ui/core/styles';

// const useStyles = makeStyles((theme) => ({

// }));

export default function FindAccountForm(): JSX.Element {
  // **************************************************
  // 스텝 할당을 위한 스테이트
  const [activeStep, setActiveStep] = React.useState(0);
  function handleNext() {
    setActiveStep((prev) => prev + 1);
  }
  // 에러 알림창 렌더링을 위한 스테이트
  const [helperOpen, setHelperOpen] = React.useState(false);
  function handleHelperOpen() {
    setHelperOpen(true);
  }
  function handleHelperClose() {
    setHelperOpen(false);
  }

  // **************************************************
  // Request users/pw
  const [newPassword, setNewPassword] = React.useState<string>();
  const [{ loading, error }, getRequest] = useAxios(
    '/users/pw', { manual: true }
  );
  // **************************************************
  // iamport 본인인증 
  const iamport = useIamportCertification((impUid) => {
    // iamport 본인인증 이후 실행될 Id 조회 함수
    getRequest({
      params: { type: 'certification', impUid }
    }).then((res) => {
      if (res.data) {
        const { password } = res.data;
        setNewPassword(password);
        // Handle to next step
        handleNext();
      }
    }).catch(() => { handleHelperOpen(); });
  });

  return (
    <div style={{ textAlign: 'center' }}>
      <Typography variant="h4">TRUEPOINT LOGO</Typography>
      {helperOpen && error && (
        <div style={{ marginTop: 32, minWidth: 300, maxWidth: 500, }}>
          <LoginHelper text="아이디 정보를 불러오는 도중에 오류가 발생했습니다. support@mytruepoint.com으로 문의바랍니다." />
        </div>
      )}

      <div style={{
        marginTop: 32,
        padding: 32,
        minWidth: 300,
        maxWidth: 500,
        border: '1px solid #ddd',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}
      >
        <br />
        <Typography variant="h6">트루포인트 비밀번호를 찾기 위해</Typography>
        <Typography variant="h6">본인인증을 진행해 주세요.</Typography>
        <br />
        <br />
        <div style={{ width: '100%', }}>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => { iamport.startCert(); }}
            style={{
              marginTop: 16, width: '100%', padding: 16, color: 'white'
            }}
          >
            <Typography variant="body1">본인인증</Typography>
          </Button>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <Button component={Link} to="/login">로그인 하러 가기</Button>
      </div>
    </div>
  );
}
