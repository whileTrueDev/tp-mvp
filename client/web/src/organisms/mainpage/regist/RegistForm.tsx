import React, { useRef, useState } from 'react';
import { useSnackbar } from 'notistack';

import {
  FormControl,
  Input,
  Divider,
  InputLabel,
  FormHelperText,
  InputAdornment,
  Button,
  MenuItem,
  TextField,
  Grid,
  Typography,
} from '@material-ui/core';
import useAxios from 'axios-hooks';
import Done from '@material-ui/icons/Done';
import CenterLoading from '../../../atoms/Loading/CenterLoading';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';

import useStyles from './style/RegistForm.style';
import {
  StepAction, StepState,
} from './Stepper.reducer';
import PasswordTextField from '../../../atoms/Input/PasswordTextField';
import axios from '../../../utils/axios';

// domain select용.
const domains = [
  { value: 'naver.com' },
  { value: 'daum.net' },
  { value: 'nate.com' },
  { value: 'gmail.com' },
  { value: 'hotmail.com' },
  { value: 'yahoo.co.kr' },
  { value: '직접입력' },
];

export interface Props {
  handleBack: () => void;
  handleUserSubmit: (user: any) => void;
  state: StepState;
  dispatch: (state: StepAction) => void;
}
// @hwasurr
// 2020.10.13 eslint error 정리 중 주석처리. 사용하지 않는 interface
// @chanuuuu 수정바랍니다.
// interface ProfileData {
//   marketerPlatformData: string;
//   marketerMail: string;
// }

function PlatformRegistForm({
  handleBack,
  handleUserSubmit,
  state,
  dispatch,
}: Props): JSX.Element {
  const [loading, setLoading] = useState(0);
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();
  // const [numberType, setNumberType] = useState(true);
  const [marketerCustomDomain, setCustomDomain] = useState('');
  const [, getRequest] = useAxios(
    '/users/check-id', { manual: true },
  );

  function handleCustom(event: React.ChangeEvent<HTMLInputElement>): void {
    setCustomDomain(event.target.value);
  }

  const handleChange = (name: any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: name, value: event.target.value });
  };

  function checkDuplicateID(): void {
    const { idValue } = state;
    if (state.id || idValue === '') {
      ShowSnack('ID를 올바르게 입력해주세요.', 'warning', enqueueSnackbar);
    } else {
      getRequest({
        params: { userId: idValue },
      }).then((res) => {
        if (res.data) {
          ShowSnack('ID가 중복되었습니다. 다른 ID를 사용해주세요.', 'warning', enqueueSnackbar);
          dispatch({ type: 'checkDuplication', value: true });
        } else {
          dispatch({ type: 'checkDuplication', value: false });
        }
      }).catch(() => {
        ShowSnack('회원가입 중 오류가 발생했습니다. 잠시후 시도해주세요.', 'error', enqueueSnackbar);
      });
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    if (state.checkDuplication) {
      ShowSnack('ID 중복 조회를 해야합니다.', 'warning', enqueueSnackbar);
      return;
    }
    const {
      id, password, repasswd, checkDuplication, emailVerified, passEmailDuplication,
    } = state;

    const mailId = state.email;

    if (mailId === '') {
      ShowSnack('E-mail 입력이 올바르지 않습니다.', 'warning', enqueueSnackbar);
      return;
    }

    if (!emailVerified || !passEmailDuplication) {
      ShowSnack('E-mail 인증이 완료되지 않았습니다.', 'warning', enqueueSnackbar);
      return;
    }

    // 모든 state가 false가 되어야한다. (리듀서에서 입력값 유효성 확인 후 false로 처리함)
    if (!(id || password || repasswd || checkDuplication)) {
      const userId = state.idValue;
      const nickName = state.nickname;
      const { name } = state;
      const phone = state.phoneNum;
      const rawPassword = state.passwordValue;
      const domain = state.domain === '직접입력' ? marketerCustomDomain : state.domain;
      const user = {
        userId,
        password: rawPassword,
        nickName,
        name,
        mail: `${mailId}@${domain}`,
        phone,
      };
      setLoading(1);
      handleUserSubmit(user);
    } else {
      ShowSnack('입력이 올바르지 않습니다.', 'error', enqueueSnackbar);
    }
  }

  // 이메일 인증관련 --------------------------------------------
  const [emailSent, setEmailSent] = useState<boolean>(false); // 이메일이 발송여부 상태 저장, 해당 값이 true일 때 코드입력창을 보여준다
  const codeInputRef = useRef<HTMLInputElement>(null);
  const getFullEmail = () => `${state.email}@${state.domain}`;

  const requestEmailVerifyCode = async () => {
    // 이메일 주소 가져오기
    const email = getFullEmail();

    // 이미 회원가입에 사용된 이메일인지 확인
    const response = await axios.get('/users/check-email', { params: { email } });
    const isEmailAlreadyRegistered = response.data;
    dispatch({ type: 'passEmailDuplication', value: !isEmailAlreadyRegistered });

    if (isEmailAlreadyRegistered) {
      alert('이미 가입된 이메일입니다.');
      return;
    }

    // 이메일 주소로 코드 보내기 요청
    axios.get('/auth/email/code', { params: { email } })
      .then((res) => {
        alert(`${email}로 인증코드가 전송되었습니다. 이메일을 받지 못한 경우 스팸메일함을 확인해주세요.`);
        // 코드 입력창 보이기
        setEmailSent(true);
        // 해당 코드는 일정 시간만 유효함 && 이메일을 받지 못했을 경우 다시 이메일 요청하라고 알리기
      })
      .catch((e) => {
        console.error(e);
        if (e.response) {
          if (e.response.status === 400) { // 3분 내로 이메일 코드 인증을 다시 한 경우
            alert(e.response.data.message);
          }
        }
      });
  };

  const EmailVerifyCodeRequestButton = (
    <Button
      variant="contained"
      color="primary"
      disabled={state.email.trim() === '' || state.domain.trim() === '' || state.emailVerified}
      onClick={requestEmailVerifyCode}
    >
      {emailSent ? '코드 재전송' : '코드 전송'}
    </Button>
  );

  let timer: NodeJS.Timeout;

  const checkVerificationCode = () => {
    if (!codeInputRef || !codeInputRef.current) return;
    const code = codeInputRef.current.value;
    if (code.trim() === '') return;

    const email = getFullEmail();
    axios.get('/auth/email/code/verify', { params: { email, code } })
      .then((res) => {
        if (res.data.result === true) {
          dispatch({ type: 'verifyEmail', value: true });
        } else {
          dispatch({ type: 'verifyEmail', value: false });
          alert('잘못되거나 유효하지 않은 코드입니다. 올바른 코드를 입력했는지 확인해주세요. 이메일을 받지 못한 경우 인증 코드 재전송을 눌러주세요.');
        }
      });
  };
  const verifyCodeDebounced = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(checkVerificationCode, 200);
  };

  const EmailVerifyCodeInput = (
    emailSent && (
      <div>
        <FormControl>
          <InputLabel shrink>인증코드</InputLabel>
          <Input
            required
            id="verificationCode"
            placeholder="메일로 발송된 인증코드를 입력해주세요"
            inputRef={codeInputRef}
            onChange={verifyCodeDebounced}
            endAdornment={(
              <InputAdornment position="end">
                {state.emailVerified && <div className={classes.successText}><Done /></div>}
              </InputAdornment>
            )}
          />
          <FormHelperText>{`${getFullEmail()}로 받은 6자리 코드를 입력해주세요.`}</FormHelperText>
        </FormControl>
      </div>

    )
  );

  return (
    <div>
      {loading
        ? (
          <div>
            <Typography variant="h6" component="h6" style={{ textAlign: 'center' }}>
              회원 등록 중입니다.
            </Typography>
            <Typography variant="h6" component="h6" style={{ textAlign: 'center' }}>
              잠시만 기다려주세요..
            </Typography>
            <CenterLoading color="secondary" size="5rem" />
          </div>
        )
        : (
          <form autoComplete="off" onSubmit={handleSubmit} id="form">
            <Grid
              container
              direction="column"
              className={classes.form}
            >
              <Grid item xs={12}>
                <FormControl error={Boolean(state.id)}>
                  <InputLabel shrink>ID</InputLabel>
                  <Input
                    required
                    id="id"
                    placeholder="아이디를 입력하세요"
                    onChange={handleChange('id')}
                    endAdornment={(
                      <InputAdornment position="end">
                        <Divider className={classes.divider} />
                        <Button onClick={() => checkDuplicateID()}>
                          중복확인
                        </Button>
                        {!state.checkDuplication && <div className={classes.successText}><Done /></div>}
                      </InputAdornment>
                    )}
                  />
                  <FormHelperText>{state.id ? '영문자로 시작하는 6-15자 영문 또는 숫자' : ' '}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item>
                <PasswordTextField
                  required
                  label="PASSWORD"
                  placeholder="비밀번호를 입력하세요."
                  className={classes.textField}
                  onChange={handleChange('password')}
                  helperText={state.password ? '특수문자를 포함한 8-20자 영문 또는 숫자' : ' '}
                  error={state.password}
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item>
                <PasswordTextField
                  required
                  label="RE-PASSWORD"
                  placeholder="비밀번호를 재입력하세요."
                  helperText={state.repasswd ? '비밀번호와 동일하지 않습니다.' : ' '}
                  error={state.repasswd}
                  className={classes.textField}
                  onChange={handleChange('repasswd')}
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item>
                <TextField
                  required
                  label="이름"
                  id="name"
                  onChange={handleChange('name')}
                  className={classes.textField}
                  placeholder="이름을 입력하세요."
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item>
                <TextField
                  required
                  label="닉네임"
                  id="nickname"
                  onChange={handleChange('nickname')}
                  className={classes.textField}
                  placeholder="별명을 입력하세요."
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  helperText="크리에이터인 경우, 활동명을 입력하세요."
                />
              </Grid>
              <Grid container direction="row">
                <Grid item xs={4}>
                  <TextField
                    required
                    label="EMAIL"
                    value={state.email}
                    // className={classes.textField}
                    onChange={handleChange('email')}
                    helperText="EMAIL을 입력하세요."
                    margin="normal"
                    id="email"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    InputProps={{
                      endAdornment: <InputAdornment position="end" className={classes.adornment}><div>@</div></InputAdornment>,
                    }}
                  />
                </Grid>
                <Grid item xs={4}>
                  {state.domain !== '직접입력' ? (
                    <TextField
                      required
                      select
                      label="Domain"
                      // className={classes.textField}
                      value={state.domain}
                      onChange={handleChange('domain')}
                      helperText="EMAIL Domain을 선택하세요."
                      InputLabelProps={{
                        shrink: true,
                      }}
                      margin="normal"
                    >
                      {domains.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.value}
                        </MenuItem>
                      ))}
                    </TextField>

                  )
                    : (
                      <TextField
                        required
                        autoFocus
                        label="Domain"
                        // className={classes.textField}
                        value={marketerCustomDomain}
                        onChange={handleCustom}
                        helperText="EMAIL Domain을 입력하세요."
                        InputLabelProps={{
                          shrink: true,
                        }}
                        margin="normal"
                      />
                    )}
                </Grid>
                <Grid item xs={4}>{EmailVerifyCodeRequestButton}</Grid>
              </Grid>
              {EmailVerifyCodeInput}
              <Grid item style={{ marginTop: '16px' }}>
                <div>
                  <Button
                    onClick={handleBack}
                    className={classes.button}
                  >
                    뒤로
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    type="submit"
                    value="submit"
                    disabled={(
                      !!state.id || !!state.password || !!state.repasswd || !!state.checkDuplication // 값이 false여야 함
                      || !state.name || !state.nickname || !state.emailVerified // 값이 true여야함
                      )}
                  >
                    가입하기
                  </Button>
                </div>
              </Grid>
            </Grid>
          </form>
        )}
    </div>
  );
}

export default PlatformRegistForm;
