import React, { useRef } from 'react';
import classnames from 'classnames';
import { Link } from 'react-router-dom';
import { Typography, Button, TextField } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import useAxios from 'axios-hooks';
import CenterLoading from '../../../atoms/Loading/CenterLoading';
import LoginHelper from '../../../atoms/LoginHelper';
import transformIdToAsterisk from '../../../utils/transformAsterisk';
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
  function handleBack() {
    setActiveStep((prev) => prev - 1);
  }
  function handleNext() {
    setActiveStep((prev) => prev + 1);
  }

  // **************************************************
  // 스텝 2 분기를 위한 스테이트
  const [selectedMethod, setSelectedMethod] = React.useState<'본인인증'|'이메일'>();
  function handleSelectedMethod(method: '본인인증' | '이메일'): void {
    setSelectedMethod(method);
  }

  // 스텝 2 에러 알림창 렌더링을 위한 스테이트
  const [helperOpen, setHelperOpen] = React.useState(false);
  function handleHelperOpen() {
    setHelperOpen(true);
  }
  function handleHelperClose() {
    setHelperOpen(false);
  }

  // **************************************************
  // Input values
  const usernameRef = useRef<HTMLInputElement>(null);
  const usermailRef = useRef<HTMLInputElement>(null);

  // **************************************************
  // Request for finding Id
  const [foundedId, setFoundedId] = React.useState<string>();
  const [{ loading, error }, getRequest] = useAxios(
    '/users/id', { manual: true }
  );
  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (usernameRef.current && usermailRef.current) {
      const username = usernameRef.current.value;
      const usermail = usermailRef.current.value;
      getRequest({
        params: { name: username, mail: usermail }
      }).then((res) => {
        if (res.data) {
          const { userId } = res.data;
          const asteriskedUserId = transformIdToAsterisk(userId);
          setFoundedId(asteriskedUserId);
          // Handle to next step
          handleNext();
        }
      }).catch(() => { handleHelperOpen(); });
    }
  }

  // **************************************************
  // iamport 본인인증 
  const iamport = useIamportCertification((impUid) => {
    // iamport 본인인증 이후 실행될 Id 조회 함수
    getRequest({
      params: { impUid }
    }).then((res) => {
      if (res.data) {
        const { userId } = res.data;
        const asteriskedUserId = transformIdToAsterisk(userId);
        setFoundedId(asteriskedUserId);
        // Handle to next step
        handleNext();
      }
    }).catch(() => { handleHelperOpen(); });
  });

  return (
    <div style={{ textAlign: 'center' }}>
      <TruepointLogo />
      {helperOpen && error && (
        <div className={classes.helper}>
          <LoginHelper text="아이디 정보를 불러오는 도중에 오류가 발생했습니다. support@mytruepoint.com으로 문의바랍니다." />
        </div>
      )}

      {/* 아이디 찾기 방법 선택 */}
      {activeStep === 0 && (
      <div className={classnames(classes.box, classes.content)}>
        <Typography variant="h6">트루포인트 아이디를 찾을</Typography>
        <Typography variant="h6">방법을 선택해 주세요.</Typography>
        <div className={classes.content}>
          <Button
            onClick={() => { handleNext(); handleSelectedMethod('이메일'); }}
            className={classes.selectButton}
          >
            <Typography variant="body1">이메일 및 이름으로 아이디 찾기</Typography>
          </Button>

          <Button
            onClick={() => { handleNext(); handleSelectedMethod('본인인증'); }}
            className={classes.selectButton}
          >
            <Typography variant="body1">휴대폰 본인인증으로 아이디 찾기</Typography>
          </Button>
        </div>
      </div>
      )}

      {/* 방법에 따른 정보 입력 - 이메일 및 이름 */}
      {activeStep === 1 && selectedMethod === '이메일' && (
      <div className={classnames(classes.box, classes.content)}>
        <Typography variant="h6">이메일, 이름으로</Typography>
        <Typography variant="h6">아이디를 찾습니다.</Typography>
        <Typography className={classes.subcontent} variant="body2">
          가입시 입력한 이메일과 이름으로 아이디를 찾습니다.
        </Typography>
        <form className={classes.content} onSubmit={handleSubmit}>
          <TextField
            color="secondary"
            type="text"
            label="이름"
            inputRef={usernameRef}
            autoComplete="off"
            className={classes.inputField}
            inputProps={{ required: true, minLength: 3 }}
          />
          <TextField
            color="secondary"
            type="email"
            label="이메일"
            inputRef={usermailRef}
            autoComplete="off"
            className={classes.inputField}
            inputProps={{ required: true, }}
          />
          <Button
            variant="contained"
            color="secondary"
            className={classes.fullButton}
            style={{ color: 'white' }}
            disabled={activeStep === 1 && loading}
            type="submit"
          >
            <Typography>아이디 찾기</Typography>
          </Button>
          <Button
            variant="contained"
            className={classes.fullButton}
            onClick={() => {
              handleBack();
              handleHelperClose();
            }}
          >
            <Typography>방법 선택으로 돌아가기</Typography>
          </Button>
        </form>
      </div>
      )}

      {/* 방법에 따른 정보 입력 - 본인 인증 */}
      {activeStep === 1 && selectedMethod === '본인인증' && (
      <div className={classnames(classes.box, classes.content)}>
        <Typography variant="h6">휴대폰 본인인증을 통해</Typography>
        <Typography variant="h6">아이디를 찾습니다.</Typography>
        <div className={classes.content}>
          <Button
            variant="contained"
            color="secondary"
            className={classes.fullButton}
            style={{ color: 'white' }}
            onClick={() => { iamport.startCert(); }}
            disabled={activeStep === 1 && loading}
          >
            <Typography>휴대폰 본인인증으로 아이디 찾기</Typography>
          </Button>
          <Button
            variant="contained"
            className={classes.fullButton}
            onClick={() => {
              handleBack();
              handleHelperClose();
            }}
          >
            <Typography>방법 선택으로 돌아가기</Typography>
          </Button>
        </div>
      </div>
      )}

      {/* 찾은 아이디 정보 렌더링 */}
      {activeStep === 2 && foundedId && (
      <div className={classnames(classes.box, classes.content)}>
        <Typography variant="h6">입력한 정보를 통해 찾은</Typography>
        <Typography variant="h6">트루포인트 아이디 정보입니다.</Typography>
        <div className={classes.content}>
          <Typography variant="h6">{foundedId}</Typography>
          <Button
            component={Link}
            to="/login"
            color="secondary"
            variant="contained"
            style={{ color: 'white' }}
            className={classes.fullButton}
          >
            <Typography variant="body1">로그인 하러 가기</Typography>
          </Button>
        </div>
      </div>
      )}
      <div className={classes.subcontent}>
        <Button component={Link} to="/login">로그인 하러 가기</Button>
      </div>

      {/* 데이터 불러오는 중 로딩 컴포넌트 */}
      {activeStep === 1 && loading && (<CenterLoading position="relative" />)}

    </div>
  );
}
