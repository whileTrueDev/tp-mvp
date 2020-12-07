import React, { useState, useReducer } from 'react';
import {
  Grid,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import useAxios from 'axios-hooks';
import { useTheme } from '@material-ui/core/styles';
import { useSnackbar } from 'notistack';
import useStyles from './style/Stepper.style';
import RegistForm from './RegistForm';
import PaperSheet from './Paper';
import IdentityVerification from './IdentityVerification';
import { myReducer, initialState } from './Stepper.reducer';
import TruepointLogo from '../../../atoms/TruepointLogo';
import TruepointLogoLight from '../../../atoms/TruepointLogoLight';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';

function RegistStepper(): JSX.Element {
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();
  const { enqueueSnackbar } = useSnackbar();
  const [activeStep, setStep] = useState(0);
  const [marketingAgreement, setAgreement] = useState(false);
  const [state, dispatch] = useReducer(myReducer, initialState);
  const [certificationInfo, setCertificationInfo] = useState({});
  const [, postRequest] = useAxios(
    {
      url: '/users',
      method: 'post',
    },
    { manual: true },
  );

  function handleNext(): void {
    setStep(activeStep + 1);
  }

  function handleBack(): void {
    dispatch({ type: 'reset' });
    setStep(activeStep - 1);
  }

  function handleReset(): void {
    dispatch({ type: 'reset' });
    setStep(0);
  }

  function handleUserSubmit(user: any): void {
    // state의 값을 이용하여 데이터를 전달한다.
    const returnUser = {
      ...user,
      ...certificationInfo,
      marketingAgreement,
    };

    postRequest({
      data: returnUser,
    })
      .then((res) => {
        if (res.data) {
          ShowSnack('회원가입이 완료되었습니다. 로그인해주세요.', 'success', enqueueSnackbar);
          history.replace('/login');
        } else {
          history.replace('/');
        }
      }).catch(() => {
        ShowSnack('회원가입 중 오류가 발생했습니다. 잠시후 시도해주세요.', 'error', enqueueSnackbar);
        history.replace('/');
      });
  }

  return (
    <div>
      <Grid container direction="column">
        <Grid item className={classes.center}>
          { theme.palette.type === 'light' ? <TruepointLogo width={280} /> : <TruepointLogoLight width={280} /> }
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
