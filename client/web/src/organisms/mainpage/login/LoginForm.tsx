import {
  Button, Checkbox, FormControlLabel, Grid, Hidden, TextField, Tooltip, Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import CheckedCheckCircleIcon from '@material-ui/icons/CheckCircle';
import CheckCircleIcon from '@material-ui/icons/CheckCircleOutline';
import useAxios from 'axios-hooks';
import classnames from 'classnames';
import React, { useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { LOGIN_PAGE_LOGO_SIZE } from '../../../assets/constants';
import CenterLoading from '../../../atoms/Loading/CenterLoading';
import LoginHelper from '../../../atoms/LoginHelper';
import TruepointLogo from '../../../atoms/TruepointLogo';
import useAuthContext from '../../../utils/hooks/useAuthContext';
import useDialog from '../../../utils/hooks/useDialog';
import { KakaoLoginButton, NaverLoginButton } from './SNSLoginButton';

const useStyles = makeStyles((theme) => ({
  loginForm: {
    position: 'relative',
    maxWidth: '380px',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '230px',
    },

  },
  upperSpace: { marginTop: theme.spacing(4) },
  formWidth: {
    width: '100%',
  },
  inputWidth: { minWidth: 280 },
  input: {
    marginBottom: theme.spacing(0.5),
  },
  alignCenter: { textAlign: 'center' },
  checkbox: { },
  loginButtonWrapper: {
    width: '100%',
  },
  loginButton: {
    fontSize: theme.typography.body1.fontSize,
  },
  alignLeft: {
    display: 'flex',
    width: '100%',
    minWidth: 300,
  },
  subButtons: {
    '& .MuiButton-label': {
      fontSize: theme.typography.caption.fontSize,
    },
  },
}));

export default function LoginForm(): JSX.Element {
  const authContext = useAuthContext();
  const history = useHistory();
  const classes = useStyles();

  // 로그인 실패 도움말
  const helperText = useDialog();
  const [helperTextValue, setHelperTextValue] = useState<string>();

  // Input Refs
  const userIdRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // 로그인 상태 유지 불린
  const [stayLogedIn, setStayLogedIn] = useState<boolean>(false);
  function handleStayLogedInToggle() {
    setStayLogedIn((prev) => !prev);
  }

  // API Requests
  const [{ loading }, executePost] = useAxios(
    { method: 'POST', url: '/auth/login' },
    { manual: true },
  );

  // Handle login form submit
  function handleLoginSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (userIdRef.current && passwordRef.current) {
      executePost({
        data: {
          userId: userIdRef.current.value,
          password: passwordRef.current.value,
          stayLogedIn, // 자동 로그인 여부
        },
      }).then((res) => {
        if (res && res.data) {
          authContext.handleLogin(res.data.access_token)
            .then(() => history.push('/mypage/main'));
        } else {
          // 올바르지 못한 요청 ( 없는 아이디인 경우 또는 비밀번호가 틀린경우)
          helperText.handleOpen();
          setHelperTextValue('로그인 과정에서 알 수 없는 오류가 발생했습니다. support@mytruepoint.com으로 문의주세요');
        }
      }).catch((err) => {
        if (err.response && err.response.status === 400) {
          helperText.handleOpen();
          setHelperTextValue('아이디 혹은 비밀번호가 일치하지 않습니다. 입력한 내용을 다시 확인해 주세요.');
        }
      });
    }
  }

  return (
    <div className={classes.loginForm}>
      {/* 로딩 컴포넌트 */}
      {loading && (<CenterLoading color="primary" size="5rem" />)}

      <form
        onSubmit={handleLoginSubmit}
        className={classnames(classes.formWidth, classes.alignCenter)}
      >
        <Hidden smDown>
          <div><TruepointLogo width={LOGIN_PAGE_LOGO_SIZE} /></div>
          <Typography
            align="center"
            color="secondary"
            variant="subtitle1"
            style={{ margin: '32px 0' }}
          >
            로그인 후 이용하실 수 있습니다.
          </Typography>
        </Hidden>

        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          className={classes.formWidth}
        >
          <Grid item>
            <TextField
              className={classnames(classes.input)}
              color="primary"
              variant="outlined"
              type="text"
              label="아이디"
              fullWidth
              placeholder="아이디를 입력해주세요"
              inputProps={{ minLength: 3, required: true }}
              inputRef={userIdRef}
              autoFocus
              size="small"
            />
            <TextField
              className={classes.input}
              color="primary"
              variant="outlined"
              type="password"
              label="비밀번호"
              fullWidth
              inputProps={{ minLength: 3, required: true }}
              placeholder="비밀번호를 입력해주세요"
              inputRef={passwordRef}
              autoComplete="off"
              size="small"
            />
          </Grid>

          <Hidden mdUp>
            <Typography
              align="center"
              color="secondary"
              variant="caption"
              style={{ margin: '16px 0' }}
            >
              로그인 후 이용하실 수 있습니다.
            </Typography>
          </Hidden>

          <Grid item className={classnames(classes.loginButtonWrapper, classes.upperSpace, classes.alignCenter)}>
            <Button
              variant="contained"
              color="primary"
              className={classes.loginButton}
              fullWidth
              type="submit"
            >
              로그인
            </Button>
          </Grid>

          {/* 로그인 상태 유지 체크박스 */}
          <Grid item style={{ width: '100%' }}>
            <Tooltip
              title={(<Typography variant="body2">개인정보 보호를 위해 개인 PC에서만 사용하시기 바랍니다.</Typography>)}
              placement="right"
              className={classes.alignLeft}
            >
              <FormControlLabel
                className={classes.checkbox}
                control={(
                  <Checkbox
                    icon={<CheckCircleIcon />}
                    checkedIcon={<CheckedCheckCircleIcon />}
                    checked={stayLogedIn}
                    onChange={handleStayLogedInToggle}
                    name="checkedA"
                    color="primary"
                    size="small"
                  />
                    )}
                label="로그인 상태 유지"
              />
            </Tooltip>
          </Grid>
        </Grid>

        {/* 로그인 실패 도움말 */}
        {helperText && helperTextValue && (
          <LoginHelper
            className={classes.upperSpace}
            text={helperTextValue}
          />
        )}
        {/* 아디/비번 찾기 */}
        <div className={classnames(classes.subButtons, classes.upperSpace, classes.alignCenter)}>
          <Button component={Link} to="/find-id">아이디 찾기</Button>
          |
          <Button component={Link} to="/find-pw">비밀번호 찾기</Button>
          |
          <Button component={Link} to="/signup">회원가입</Button>
        </div>

        {/* ********************************************** */}

        <div className={classnames('social-login-section', classes.upperSpace)}>
          <KakaoLoginButton />
          <NaverLoginButton />
        </div>
      </form>
    </div>
  );
}
