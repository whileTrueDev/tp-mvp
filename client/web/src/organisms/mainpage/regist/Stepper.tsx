import React, { useState, useReducer } from 'react';
import {
  Grid,
} from '@material-ui/core';
import { useHistory, useLocation } from 'react-router-dom';
import useAxios from 'axios-hooks';
import { useTheme } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import useStyles from './style/Stepper.style';
import RegistForm from './RegistForm';
import PaperSheet from './Paper';
import IdentityVerification from './IdentityVerification';
import { myReducer, initialState } from './Stepper.reducer';
import TruepointLogo from '../../../atoms/TruepointLogo';
import TruepointLogoLight from '../../../atoms/TruepointLogoLight';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import SignUpCompleted from './SignUpCompleted';

function RegistStepper(): JSX.Element {
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [activeStep, setStep] = useState(0);
  const [marketingAgreement, setAgreement] = useState(false);
  const [state, dispatch] = useReducer(myReducer, initialState);
  const [certificationInfo, setCertificationInfo] = useState({});

  // 회원가입 요청 객체
  const [, postRequest] = useAxios<User>(
    { url: '/users', method: 'post' }, { manual: true },
  );

  // 스텝 next
  function handleNext(): void {
    setStep(activeStep + 1);
  }

  // 스텝 back
  function handleBack(): void {
    dispatch({ type: 'reset' });
    setStep(activeStep - 1);
  }

  // 스텝을 0 으로 리셋
  function handleReset(): void {
    dispatch({ type: 'reset' });
    setStep(0);
  }

  // 가입된 유저 이름을 회원가입 완료 페이지에서 보여주기 위한 스테이트 
  const [generatedUserId, setGeneratedUserId] = useState('');

  // 회원가입 요청 핸들러
  function handleUserSubmit(user: any): void {
    // state의 값을 이용하여 데이터를 전달한다.
    const returnUser = {
      ...user, ...certificationInfo, marketingAgreement,
    };

    postRequest({ data: returnUser })
      .then((res) => {
        if (res.data) {
          // 회원가입 완료 페이지 추가로 주석처리 from @hwasurr, 20.12.04
          // ShowSnack('회원가입이 완료되었습니다. 로그인해주세요.', 'success', enqueueSnackbar);
          // **************************************************************************
          // 회원가입 완료 페이지 추가로 /login 으로 이동 대신 회원가입 완료 페이지 로 이동
          setGeneratedUserId(res.data.userId);
          history.push('/signup/completed');
        } else {
          ShowSnack('회원가입 중 오류가 발생했습니다. 잠시후 시도해주세요.', 'error', enqueueSnackbar);
          setTimeout(() => history.replace('/'), 2 * 1000);
        }
      }).catch(() => {
        ShowSnack('회원가입 중 오류가 발생했습니다. 잠시후 시도해주세요.', 'error', enqueueSnackbar);
        setTimeout(() => history.replace('/'), 2 * 1000);
      });
  }

  // 회원가입 완료 페이지 (@author hwasurr 2020.12.04)
  const location = useLocation();
  if (generatedUserId && location.pathname === '/signup/completed') {
    return (
      <div>
        <Grid item className={classes.center}>
          { theme.palette.type === 'light' ? <TruepointLogo width={300} /> : <TruepointLogoLight width={300} /> }
        </Grid>
        <SignUpCompleted generatedUserId={generatedUserId} />
      </div>
    );
  }

  return (
    <div>
      <Grid container direction="column">
        <Grid item className={classes.center}>
          { theme.palette.type === 'light' ? <TruepointLogo /> : <TruepointLogoLight /> }
        </Grid>
        <Grid item>
          {activeStep === 0 && (
          <IdentityVerification
            handleNext={handleNext}
            handleBack={handleBack}
            setCertificationInfo={setCertificationInfo}
          />
          )}
          {activeStep === 1 && (
          <PaperSheet
            handleNext={handleNext}
            handleBack={handleReset}
            setAgreement={setAgreement}
          />
          )}
        </Grid>
      </Grid>
      {activeStep === 2 && (
        <RegistForm
          handleBack={handleBack}
          handleUserSubmit={handleUserSubmit}
          state={state}
          dispatch={dispatch}
        />
      )}
    </div>
  );
}

export default RegistStepper;
