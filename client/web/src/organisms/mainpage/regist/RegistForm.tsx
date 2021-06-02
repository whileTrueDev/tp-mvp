import React, { useState } from 'react';
import NumberFormat from 'react-number-format';
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
  FormControlLabel,
  Radio,
} from '@material-ui/core';
import useAxios from 'axios-hooks';
import Done from '@material-ui/icons/Done';
import CenterLoading from '../../../atoms/Loading/CenterLoading';
import ShowSnack from '../../../atoms/snackbar/ShowSnack';

import useStyles from './style/RegistForm.style';
import StyledInput from '../../../atoms/StyledInput';
import {
  StepAction, StepState,
} from './Stepper.reducer';
import PasswordTextField from '../../../atoms/Input/PasswordTextField';

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
  const [numberType, setNumberType] = useState(true);
  const [marketerCustomDomain, setCustomDomain] = useState('');
  const [, getRequest] = useAxios(
    '/users/check-id', { manual: true },
  );

  function handleCustom(event: React.ChangeEvent<HTMLInputElement>): void {
    setCustomDomain(event.target.value);
  }

  function handleTypeToogle(): void {
    setNumberType(!numberType);
  }

  const handleChange = (name: any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: name, value: event.target.value });
  };

  function handleChangePhone(value: any): void {
    dispatch({ type: 'phoneNum', value: value.formattedValue });
  }

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
      id, password, repasswd, checkDuplication,
    } = state;

    const mailId = state.email;

    if (mailId === '') {
      ShowSnack('E-mail 입력이 올바르지 않습니다.', 'warning', enqueueSnackbar);
      return;
    }
    // 모든 state가 false가 되어야한다.
    if (!(id || password || repasswd || checkDuplication)) {
      const userId = state.idValue;
      const nickName = state.name;
      const phone = state.phoneNum;
      const rawPassword = state.passwordValue;
      const domain = state.domain === '직접입력' ? marketerCustomDomain : state.domain;
      const user = {
        userId,
        password: rawPassword,
        nickName,
        mail: `${mailId}@${domain}`,
        phone,
      };
      setLoading(1);
      handleUserSubmit(user);
    } else {
      ShowSnack('입력이 올바르지 않습니다.', 'error', enqueueSnackbar);
    }
  }

  const requestEmailVerifyCode = () => {
    const email = `${state.email}@${state.domain}`;
    console.log('이메일 인증', email);
  };
  const EmailVerifyCodeButton = (
    <Button
      variant="contained"
      disabled={state.email.trim() === '' || state.domain.trim() === ''}
      onClick={requestEmailVerifyCode}
    >
      코드 전송
    </Button>
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
              <Grid container direction="row">
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
              </Grid>
              <Grid item container direction="row">
                <Grid item>
                  <TextField
                    required
                    label="별명"
                    id="name"
                    onChange={handleChange('name')}
                    className={classes.textField}
                    placeholder="별명을 입력하세요."
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                    helperText="크리에이터인 경우, 활동명을 입력하세요."
                  />
                </Grid>
                <Grid item>
                  <Grid container direction="row">
                    <Grid item>
                      <FormControl
                        className={classes.phoneField}
                        required
                        margin="normal"
                      >
                        <InputLabel shrink htmlFor="phoneNumber">전화번호</InputLabel>
                        <NumberFormat
                          placeholder="( ___ ) - ____ - ____"
                          value={state.phoneNum}
                          onValueChange={handleChangePhone}
                          customInput={StyledInput}
                          format={numberType ? '( ### ) - #### - ####' : '( ### ) - ### - ####'}
                          className={classes.phoneField}
                          allowNegative={false}
                        />
                        {/* <FormHelperText>트루포인트와 연락할 전화번호를 입력하세요.</FormHelperText> */}
                      </FormControl>
                    </Grid>
                    <Grid item className={classes.switchbox}>
                      <Divider className={classes.divider} />
                      <Grid container direction="row">
                        <Grid item>
                          <FormControlLabel
                            value="phone"
                            control={(
                              <Radio
                                checked={numberType}
                                onChange={handleTypeToogle}
                                inputProps={{ 'aria-label': 'A' }}
                                size="small"
                                color="primary"
                              />
                            )}
                            className={classes.switch}
                            label="휴대폰"
                            labelPlacement="bottom"
                          />
                        </Grid>
                        <Grid item>
                          <FormControlLabel
                            value="tel"
                            control={(
                              <Radio
                                checked={!numberType}
                                onChange={handleTypeToogle}
                                inputProps={{ 'aria-label': 'A' }}
                                size="small"
                                color="primary"
                              />
                            )}
                            className={classes.switch}
                            label="회사"
                            labelPlacement="bottom"
                          />
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              <Grid container direction="row">
                <Grid item>
                  <TextField
                    required
                    label="EMAIL"
                    value={state.email}
                    className={classes.textField}
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
                <Grid item>
                  {state.domain !== '직접입력' ? (
                    <TextField
                      required
                      select
                      label="Domain"
                      className={classes.textField}
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
                        className={classes.textField}
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
                <Grid item>{EmailVerifyCodeButton}</Grid>
              </Grid>
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
