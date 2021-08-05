import { Button, TextField, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { LOGIN_PAGE_LOGO_SIZE } from '../../../assets/constants';
import CenterLoading from '../../../atoms/Loading/CenterLoading';
import LoginHelper from '../../../atoms/LoginHelper';
import TruepointLogo from '../../../atoms/TruepointLogo';
import { QueryParam, useFindIdQuery } from '../../../utils/hooks/query/useFindIdQuery';
import useDialog from '../../../utils/hooks/useDialog';
// import useIamportCertification from '../../../utils/hooks/useIamportCertification';
import transformIdToAsterisk from '../../../utils/transformAsterisk';
import { KakaoLoginButton, NaverLoginButton } from './SNSLoginButton';

export const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    padding: `${theme.spacing(8)}px ${theme.spacing(4)}px`,
    minWidth: 300,
    maxWidth: 500,
    border: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  subcontent: { marginTop: theme.spacing(2) },
  content: { width: '100%', marginTop: theme.spacing(4) },
  selectButton: { width: '100%', padding: 16, borderBottom: `1px solid ${theme.palette.divider}` },
  fullButton: {
    padding: theme.spacing(2), marginTop: theme.spacing(2), width: '100%',
  },
  inputField: { width: '100%' },
  helper: { marginTop: 32, minWidth: 300, maxWidth: 500 },
}));

export default function FindAccountForm(): JSX.Element {
  const classes = useStyles();
  // **************************************************
  // 스텝 할당을 위한 스테이트
  const [activeStep, setActiveStep] = React.useState(0);
  const [helperText, setHelperText] = React.useState<string>();

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
  const helperTextDialog = useDialog();

  // **************************************************
  // Input values
  const usermailRef = useRef<HTMLInputElement>(null);

  // **************************************************
  // Request for finding Id
  const [queryParam, setQueryParam] = React.useState<QueryParam | null>(null);
  const { data, isFetching: loading } = useFindIdQuery(queryParam, {
    enabled: !!queryParam,
    onSuccess: (resData) => {
      if (resData) {
        const { userId } = resData;
        if (userId) {
          // Handle to next step
          handleNext();
        } else {
          // 계정이 존재하지 않으므로
          setHelperText('본인인증된 정보로 가입된 계정이 존재하지 않습니다. \n 다시 입력해 주세요.');
          helperTextDialog.handleOpen();
        }
      }
    },
    onError: () => {
      helperTextDialog.handleOpen();
    },
  });

  function handleSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (usermailRef.current) {
      const usermail = usermailRef.current.value;
      setQueryParam({ column: 'mail', value: usermail });
    }
  }

  // **************************************************
  // iamport 본인인증 
  // const iamport = useIamportCertification((impUid) => {
  //   // iamport 본인인증 이후 실행될 Id 조회
  //   if (impUid) {
  //     setQueryParam({ column: 'impUid', value: impUid });
  //   }
  // });

  // **************************************************
  //* 카카오, 네이버 로그인 사용자의 경우 해당 플랫폼으로 로그인하기 버튼을 렌더링한다
  function renderIdInfoByPlatform() {
    if (!data || !queryParam) return null;
    const { userId, provider } = data;
    const { value } = queryParam;
    if (provider === 'kakao') {
      return (
        <>
          <Typography variant="h6">카카오 계정으로 가입된 회원입니다.</Typography>
          <div className={classes.content}>
            <Typography variant="h6">입력한 이메일 : </Typography>
            <Typography variant="h6" gutterBottom>{value}</Typography>
            <KakaoLoginButton />
          </div>
        </>
      );
    }
    if (provider === 'naver') {
      return (
        <>
          <Typography variant="h6">네이버 계정으로 가입된 회원입니다.</Typography>
          <div className={classes.content}>
            <Typography variant="h6">입력한 이메일 : </Typography>
            <Typography variant="h6" gutterBottom>{value}</Typography>
            <NaverLoginButton />
          </div>
        </>
      );
    }
    return (
      <>
        <Typography variant="h6">입력한 정보를 통해 찾은</Typography>
        <Typography variant="h6">트루포인트 아이디 정보입니다.</Typography>
        <div className={classes.content}>
          <Typography variant="h6">
            {transformIdToAsterisk(userId)}
          </Typography>
          <Button
            component={Link}
            to="/login"
            color="primary"
            variant="contained"
            style={{ color: 'white' }}
            className={classes.fullButton}
          >
            <Typography variant="body1">로그인 하러 가기</Typography>
          </Button>
        </div>
      </>
    );
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <TruepointLogo width={LOGIN_PAGE_LOGO_SIZE} />
      {helperTextDialog.open && helperText && (
        <div className={classes.helper}>
          <LoginHelper text={helperText} />
        </div>
      )}

      {/* 아이디 찾기 방법 선택 */}
      {activeStep === 0 && (
      <div className={classnames(classes.box, classes.content)}>
        <Typography variant="h6">트루포인트 아이디를 찾을</Typography>
        <Typography variant="h6">방법을 선택해 주세요.</Typography>
        <div className={classes.content}>
          <Button
            onClick={() => {
              handleNext(); handleSelectedMethod('이메일');
            }}
            className={classes.selectButton}
          >
            <Typography variant="body1">이메일로 아이디 찾기</Typography>
          </Button>

          {/* 휴대폰 본인인증은 추후 기획에 따라 지원 */}
          {/* <Button
            onClick={() => {
              handleNext(); handleSelectedMethod('본인인증');
            }}
            className={classes.selectButton}
          >
            <Typography variant="body1">휴대폰 본인인증으로 아이디 찾기</Typography>
          </Button> */}
        </div>
      </div>
      )}

      {/* 방법에 따른 정보 입력 - 이메일 */}
      {activeStep === 1 && selectedMethod === '이메일' && (
      <div className={classnames(classes.box, classes.content)}>
        <Typography variant="h6">이메일로</Typography>
        <Typography variant="h6">아이디를 찾습니다.</Typography>
        <Typography className={classes.subcontent} variant="body2">
          가입시 입력한 이메일로 아이디를 찾습니다.
        </Typography>
        <form className={classes.content} onSubmit={handleSubmit}>

          <TextField
            color="primary"
            type="email"
            label="이메일"
            inputRef={usermailRef}
            autoComplete="off"
            className={classes.inputField}
            inputProps={{ required: true }}
          />
          <Button
            variant="contained"
            color="primary"
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
              helperTextDialog.handleClose();
            }}
          >
            <Typography>방법 선택으로 돌아가기</Typography>
          </Button>
        </form>
      </div>
      )}

      {/* 방법에 따른 정보 입력 - 본인 인증 */}
      {/* 휴대폰 본인인증은 추후 기획에 따라 지원 */}
      {/* {activeStep === 1 && selectedMethod === '본인인증' && (
      <div className={classnames(classes.box, classes.content)}>
        <Typography variant="h6">휴대폰 본인인증을 통해</Typography>
        <Typography variant="h6">아이디를 찾습니다.</Typography>
        <div className={classes.content}>
          <Button
            variant="contained"
            color="primary"
            className={classes.fullButton}
            style={{ color: 'white' }}
            onClick={() => {
              iamport.startCert();
            }}
            disabled={activeStep === 1 && loading}
          >
            <Typography>휴대폰 본인인증으로 아이디 찾기</Typography>
          </Button>
          <Button
            variant="contained"
            className={classes.fullButton}
            onClick={() => {
              handleBack();
              helperTextDialog.handleClose();
            }}
          >
            <Typography>방법 선택으로 돌아가기</Typography>
          </Button>
        </div>
      </div>
      )} */}

      {/* 찾은 아이디 정보 렌더링 */}
      {activeStep === 2 && data && (
      <div className={classnames(classes.box, classes.content)}>
        {renderIdInfoByPlatform()}
      </div>
      )}

      {!(activeStep === 2 && data) && (
      <div className={classes.subcontent}>
        <Button component={Link} to="/login">로그인 하러 가기</Button>
      </div>
      )}

      {/* 데이터 불러오는 중 로딩 컴포넌트 */}
      {activeStep === 1 && loading && (<CenterLoading position="relative" />)}

    </div>
  );
}
