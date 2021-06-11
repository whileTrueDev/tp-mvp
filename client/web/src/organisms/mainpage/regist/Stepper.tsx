import {
  Grid, Hidden,
} from '@material-ui/core';
import { User } from '@truepoint/shared/dist/interfaces/User.interface';
import useAxios from 'axios-hooks';
import { useSnackbar } from 'notistack';
import React, { useReducer, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';
import TruepointLogo from '../../../atoms/TruepointLogo';
import PageTitle from '../shared/PageTitle';
// import IdentityVerification from './IdentityVerification';
import PaperSheet from './Paper';
import RegistForm from './RegistForm';
import SignUpCompleted from './SignUpCompleted';
import { initialState, myReducer } from './Stepper.reducer';
import useStyles from './style/Stepper.style';

function RegistStepper(): JSX.Element {
  const history = useHistory();
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  const [activeStep, setStep] = useState(0);
  const [marketingAgreement, setAgreement] = useState(false);
  const [state, dispatch] = useReducer(myReducer, initialState);
  const [certificationInfo] = useState({}); // 휴대폰 인증 후 받은 인증유저정보
  // certificationInfo : {
  //   name,
  //   gender,
  //   birth: birthday,
  //   userDI,
  // }

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
  function handleUserSubmit(user: {
    userId: string;
    password: string | number;
    nickName: string;
    mail: string;
    name: string;
    phone: string | number;
}): void {
    // state의 값을 이용하여 데이터를 전달한다.

    let returnUser: any = {
      ...user, ...certificationInfo, marketingAgreement,
    };
    // 휴대폰 인증 과정을 거치지 않은 경우 
    // 휴대폰인증시 입력했던 정보 - 이름, 성별, 생일, 인증했던 식별값이 리턴되지 않으므로 임의의 값을 넣는다
    if (Object.keys(certificationInfo).length === 0) {
      returnUser = {
        ...returnUser,
        gender: '',
        birth: '',
        userDI: `${user.userId}_${user.mail}`,
      };
    }

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
      }).catch((err) => {
        console.error(err);
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
          <Hidden xsDown>
            <Grid className={classes.center}>
              <TruepointLogo width={300} />
            </Grid>
          </Hidden>
        </Grid>
        <PageTitle text="회원가입 완료" />
        <SignUpCompleted generatedUserId={generatedUserId} />
      </div>
    );
  }

  function getComponentByStep(step: number) {
    switch (step) {
      case 0:
        return (
          <PaperSheet
            handleNext={handleNext}
            handleBack={history.goBack}
            setAgreement={setAgreement}
          />
        );
      case 1:
        return (
          <RegistForm
            handleBack={handleBack}
            handleUserSubmit={handleUserSubmit}
            state={state}
            dispatch={dispatch}
          />
        );
      default:
        handleReset();
        return null;
    }
  }

  return (
    <>
      <Hidden xsDown>
        <Grid className={classes.center}>
          <TruepointLogo width={300} />
        </Grid>
      </Hidden>
      {getComponentByStep(activeStep)}
      {/* 
          기존 휴대폰인증 -> 약관동의 -> 정보입력 과정을
          약관동의 -> 정보입력 -> 이메일 인증으로 변경 20210601 joni (휴대폰인증은 차후 기획에 따라 추가)
          */}
      {/* {activeStep === 0 && (
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
          {activeStep === 2 && (
          <RegistForm
            handleBack={handleBack}
            handleUserSubmit={handleUserSubmit}
            state={state}
            dispatch={dispatch}
          />
          )} */}

    </>
  );
}

export default RegistStepper;
