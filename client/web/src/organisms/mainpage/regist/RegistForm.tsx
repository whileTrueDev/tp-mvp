import React, { useRef, useState } from 'react';
import { useSnackbar } from 'notistack';

import {
  FormControl,
  Divider,
  InputLabel,
  FormHelperText,
  InputAdornment,
  Button,
  TextField,
  Grid,
  Typography,
  OutlinedInput,
  CircularProgress,
} from '@material-ui/core';
import Done from '@material-ui/icons/Done';
import classnames from 'classnames';
import CenterLoading from '../../../atoms/Loading/CenterLoading';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';

import useStyles from './style/RegistForm.style';
import {
  StepAction, StepState,
} from './Stepper.reducer';
import PasswordTextField from '../../../atoms/Input/PasswordTextField';
import axios from '../../../utils/axios';
import PageTitle from '../shared/PageTitle';
import { useCheckIdDuplicate } from '../../../utils/hooks/query/useCheckDuplicatedId';
import { useCheckNicknameDuplicate } from '../../../utils/hooks/query/useCheckDuplicatedNickname';
import { useCheckEmailDuplicate } from '../../../utils/hooks/query/useCheckDuplicatedEmail';

export interface Props {
  handleBack: () => void;
  handleUserSubmit: (user: any) => void;
  state: StepState;
  dispatch: (state: StepAction) => void;
}

function PlatformRegistForm({
  handleBack,
  handleUserSubmit,
  state,
  dispatch,
}: Props): JSX.Element {
  const [loading, setLoading] = useState(0);
  const classes = useStyles();
  const { enqueueSnackbar } = useSnackbar();

  // id, nickname, email 중복확인 위한 param state
  const [checkValues, setCheckValues] = useState<{
    id: string,
    nickname: string,
    email: string
  }>({
    id: '',
    nickname: '',
    email: '',
  });

  // 아이디 중복확인 요청
  useCheckIdDuplicate(checkValues.id, {
    enabled: !!checkValues.id,
    onSuccess: (isDuplicated) => {
      if (isDuplicated) {
        ShowSnack('ID가 중복되었습니다. 다른 ID를 사용해주세요.', 'warning', enqueueSnackbar);
      }
      dispatch({ type: 'checkDuplication', value: isDuplicated });
    },
    onError: (e) => {
      console.error('아이디 중복 조회 오류', e);
      ShowSnack('아이디 중복 조회 중 오류가 발생했습니다. 잠시후 시도해주세요.', 'error', enqueueSnackbar);
    },
    onSettled: () => setCheckValues((prev) => ({ ...prev, id: '' })),
  });

  // 닉네임 중복확인 요청
  useCheckNicknameDuplicate(checkValues.nickname, {
    enabled: !!checkValues.nickname,
    onSuccess: (isDuplicated) => {
      if (isDuplicated) { // 중복시 리턴값 true, 중복 안됐으면 false
        ShowSnack('닉네임이 중복되었습니다. 다른 닉네임을 사용해주세요.', 'warning', enqueueSnackbar);
      }
      dispatch({ type: 'isNicknameDuplicated', value: isDuplicated });
    },
    onError: (e) => {
      console.error('닉네임 중복 조회 오류', e);
      ShowSnack('닉네임 중복 조회 중 오류가 발생했습니다. 잠시후 시도해주세요.', 'error', enqueueSnackbar);
    },
    onSettled: () => setCheckValues((prev) => ({ ...prev, nickname: '' })),
  });

  const handleChange = (name: any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: name, value: event.target.value });
  };

  //* ***************** 아이디 중복확인 실행 함수 ******************
  function checkDuplicateID(): void {
    const { idValue } = state;
    if (state.id || idValue === '') {
      ShowSnack('ID를 올바르게 입력해주세요.', 'warning', enqueueSnackbar);
    } else {
      setCheckValues((prev) => ({ ...prev, id: idValue }));
    }
  }

  //* ***************** 닉네임 중복확인 실행 함수 ******************
  function checkDuplicateNickname(): void {
    const { nickname } = state;
    if (!nickname.trim()) {
      ShowSnack('닉네임을 올바르게 입력해주세요.', 'warning', enqueueSnackbar);
    } else {
      setCheckValues((prev) => ({ ...prev, nickname: nickname.trim() }));
    }
  }

  //* ***************** 회원 가입 함수 ******************
  function handleSubmit(event: React.FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const {
      id, password, repasswd, checkDuplication, emailVerified, isEmailDuplicated, email,
      isNicknameDuplicated,
    } = state;

    if (checkDuplication) {
      ShowSnack('ID 중복 조회를 해야합니다.', 'warning', enqueueSnackbar);
      return;
    }
    if (isNicknameDuplicated) {
      ShowSnack('닉네임 중복 조회를 해야합니다.', 'warning', enqueueSnackbar);
      return;
    }

    if (email === '') {
      ShowSnack('E-mail 입력이 올바르지 않습니다.', 'warning', enqueueSnackbar);
      return;
    }

    if (!emailVerified || !isEmailDuplicated) {
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
      const user = {
        userId,
        password: rawPassword,
        nickName,
        name,
        mail: email,
        phone,
      };
      setLoading(1);
      handleUserSubmit(user);
    } else {
      ShowSnack('입력이 올바르지 않습니다.', 'error', enqueueSnackbar);
    }
  }

  // ***********************************************************
  // 이메일 인증관련 ***********************************************
  const [emailSent, setEmailSent] = useState<boolean>(false); // 이메일이 발송여부 상태 저장, 해당 값이 true일 때 코드입력창을 보여준다
  const [emailSending, setEmailSending] = useState<boolean>(false); // 이메일 발송중인지 여부(로딩상태)
  const codeInputRef = useRef<HTMLInputElement>(null);
  const getFullEmail = () => state.email;

  // 2. 이미 회원가입에 사용된 이메일인지 확인
  useCheckEmailDuplicate(checkValues.email, {
    enabled: !!checkValues.email,
    onSuccess: (isDuplicated) => {
      dispatch({ type: 'isEmailDuplicated', value: isDuplicated });
      if (isDuplicated) { // 중복시 리턴값 true, 중복 안됐으면 false
        ShowSnack('중복된 이메일입니다. 다른 이메일을 사용해주세요.', 'warning', enqueueSnackbar);
      } else {
        // 이메일 주소로 코드 보내기 요청 실행
      }
    },
    onError: (e) => {
      console.error('이메일 중복 조회 오류', e);
      ShowSnack('이메일 중복 조회 중 오류가 발생했습니다. 잠시후 시도해주세요.', 'error', enqueueSnackbar);
    },
    onSettled: () => setCheckValues((prev) => ({ ...prev, email: '' })),
  });

  // 3. 이메일 주소로 코드 보내기 요청
  // const {isFetching:loadingemailSending} = useSendEmailQuery(checkValues.email, {
  //   enabled: 
  // })

  //* ***************** 이메일 인증코드 요청 함수 ******************
  const requestEmailVerifyCode = async () => {
    // 1. 이메일 주소 가져오기
    const email = getFullEmail();

    // 2. 이미 회원가입에 사용된 이메일인지 확인
    setCheckValues((prev) => ({ ...prev, email }));
    const response = await axios.get('/users/check-email', { params: { email } });
    const isEmailAlreadyRegistered = response.data;
    dispatch({ type: 'isEmailDuplicated', value: isEmailAlreadyRegistered });

    if (isEmailAlreadyRegistered) {
      alert('이미 가입된 이메일입니다. 다른 이메일을 사용해주세요.');
      return;
    }

    setEmailSending(true);
    // 3. 이메일 주소로 코드 보내기 요청
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
          if (e.response.status === 500) {
            alert('이메일 코드 전송 에러가 발생했습니다. 문제가 계속되는 경우 고객센터로 문의 바랍니다.');
          }
        }
      })
      .finally(() => setEmailSending(false));
  };

  //* ***************** 이메일 인증코드 유효한지 확인하는 함수 ******************
  const checkVerificationCode = () => {
    if (!codeInputRef || !codeInputRef.current) return;
    const code = codeInputRef.current.value;
    if (code.trim() === '' || code.length < 6) return;

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

  // 인증코드 한글자씩 입력할때마다 매번 실행되지 않고
  // 일정 시간 후에만 checkVerificationCode가 실행되도록 지연시키는 함수
  let timer: NodeJS.Timeout;
  const verifyCodeDebounced = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(checkVerificationCode, 200);
  };

  return (
    <div className={classes.registForm}>
      <PageTitle text="기본정보 입력" />
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
            >
              {/* 아이디 입력 인풋 */}
              <Grid item className={classes.row}>
                <InputLabel shrink>아이디</InputLabel>
                <FormControl error={Boolean(state.id)}>
                  <OutlinedInput
                    required
                    id="id"
                    fullWidth
                    margin="dense"
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
              {/* 비밀번호 인풋 */}
              <Grid item className={classes.row}>
                <PasswordTextField
                  variant="outlined"
                  required
                  label="비밀번호"
                  fullWidth
                  placeholder="비밀번호를 입력하세요."
                  className={classes.textField}
                  onChange={handleChange('password')}
                  helperText={state.password ? '8-20자 영문 또는 숫자' : ' '}
                  error={state.password}
                />
              </Grid>
              {/* 비밀번호 재확인 인풋 */}
              <Grid item className={classes.row}>
                <PasswordTextField
                  variant="outlined"
                  required
                  label="비밀번호 재확인"
                  placeholder="비밀번호를 재입력하세요."
                  helperText={state.repasswd ? '비밀번호와 동일하지 않습니다.' : ' '}
                  error={state.repasswd}
                  className={classes.textField}
                  onChange={handleChange('repasswd')}
                />
              </Grid>
              {/* 이름 인풋 */}
              {/* <Grid item className={classes.row}>
                <InputLabel shrink>이름</InputLabel>
                <TextField
                  required
                  id="name"
                  variant="outlined"
                  margin="dense"
                  size="small"
                  onChange={handleChange('name')}
                  className={classes.textField}
                  placeholder="이름을 입력하세요."
                />
              </Grid> */}
              {/* 닉네임 인풋 */}
              <Grid item className={classes.row} style={{ marginBottom: 8 }}>
                <InputLabel shrink>닉네임</InputLabel>
                <FormControl>
                  <OutlinedInput
                    required
                    id="nickname"
                    fullWidth
                    margin="dense"
                    placeholder="닉네임을 입력하세요"
                    onChange={handleChange('nickname')}
                    endAdornment={(
                      <InputAdornment position="end">
                        <Divider className={classes.divider} />
                        <Button onClick={() => checkDuplicateNickname()}>
                          중복확인
                        </Button>
                        {!state.isNicknameDuplicated && <div className={classes.successText}><Done /></div>}
                      </InputAdornment>
                    )}
                  />
                  <FormHelperText>크리에이터인 경우, 활동명을 입력하세요.</FormHelperText>
                </FormControl>
              </Grid>
              {/* 이메일 인풋과 코드전송버튼 */}
              <Grid container direction="row" alignItems="center">
                <Grid item>
                  <InputLabel shrink>이메일</InputLabel>
                </Grid>
                <Grid item container className={classes.row} alignItems="center">
                  <Grid item xs={8}>
                    <TextField
                      required
                      id="fullEmail"
                      type="email"
                      variant="outlined"
                      margin="dense"
                      size="small"
                      fullWidth
                      onChange={handleChange('email')}
                      placeholder="이메일"
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      disabled={!state.isValidEmail || state.emailVerified || emailSending}
                      onClick={requestEmailVerifyCode}
                    >
                      {emailSent ? '코드 재전송' : '코드 전송'}
                      {emailSending && (
                      <CircularProgress
                        disableShrink
                        size={10}
                        thickness={5}
                        variant="indeterminate"
                      />
                      )}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>

              {/* 인증코드 전송했을때만 보임 - 이메일 코드 확인 인풋 */}
              {emailSent && (
              <Grid item className={classes.row}>
                <FormControl>
                  <TextField
                    required
                    label="코드입력"
                    variant="outlined"
                    size="small"
                    margin="dense"
                    id="verificationCode"
                    placeholder="메일로 발송된 인증코드를 입력해주세요"
                    inputRef={codeInputRef}
                    onChange={verifyCodeDebounced}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          {state.emailVerified && <div className={classes.successText}><Done /></div>}
                        </InputAdornment>
                      ),
                    }}
                  />
                  <FormHelperText>{`${getFullEmail()}로 받은 6자리 코드를 입력해주세요.`}</FormHelperText>
                </FormControl>
              </Grid>

              )}

              {/* 뒤로, 가입 버튼 */}
              <Grid item container spacing={1} className={classes.row} style={{ marginTop: '16px' }}>
                <Grid item xs={6}>
                  <Button
                    onClick={handleBack}
                    className={classnames(classes.button, 'back')}
                  >
                    뒤로
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    type="submit"
                    value="submit"
                    disabled={(
                      state.password
                      || state.repasswd
                      || state.checkDuplication
                      || state.isNicknameDuplicated
                      || Boolean(state.id)
                      || !state.name
                      || !state.nickname
                      || !state.emailVerified
                      )}
                  >
                    가입
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </form>
        )}
    </div>
  );
}

export default PlatformRegistForm;
