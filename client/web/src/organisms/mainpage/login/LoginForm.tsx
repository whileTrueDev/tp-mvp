import React, { useRef, useState } from 'react';
import classnames from 'classnames';
import { useHistory, Link } from 'react-router-dom';
import useAxios from 'axios-hooks';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  Button, TextField,
} from '@material-ui/core';

import CenterLoading from '../../../atoms/Loading/CenterLoading';
import LoginHelper from '../../../atoms/LoginHelper';
import TruepointLogo from '../../../atoms/TruepointLogo';
import useDialog from '../../../utils/hooks/useDialog';
import useAuthContext from '../../../utils/hooks/useAuthContext';

const useStyles = makeStyles((theme) => ({
  upperSpace: { marginTop: theme.spacing(4) },
  formWidth: { width: 300, textAlign: 'center' },
  button: { width: 130, boxShadow: 'none', padding: 8 },
  buttonset: { display: 'flex', justifyContent: 'space-between', width: '100%' },
}));

export default function LoginForm(): JSX.Element {
  const authContext = useAuthContext();
  const history = useHistory();
  const theme = useTheme();
  const classes = useStyles();

  // 로그인 실패 도움말
  const helperText = useDialog();
  const [helperTextValue, setHelperTextValue] = useState<string>();

  // Input Refs
  const userIdRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  // API Requests
  const [{ loading }, executePost] = useAxios(
    { method: 'POST', url: '/auth/login' },
    { manual: true }
  );

  // Handle login form submit
  function handleLoginSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (userIdRef.current && passwordRef.current) {
      executePost({
        data: {
          userId: userIdRef.current.value,
          password: passwordRef.current.value
        }
      }).then((res) => {
        if (res && res.data) {
          authContext.handleLogin(res.data.access_token);
          history.push('/mypage/main');
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
    <>
      {/* 로딩 컴포넌트 */}
      {loading && (<CenterLoading color="secondary" size="5rem" />)}

      <form
        onSubmit={handleLoginSubmit}
        className={classes.formWidth}
      >
        <TruepointLogo />

        <TextField
          className={classnames(classes.upperSpace, classes.formWidth)}
          color="secondary"
          type="text"
          label="아이디"
          placeholder="아이디를 입력해주세요"
          inputProps={{ minLength: 3, required: true, }}
          inputRef={userIdRef}
          autoFocus
        />
        <TextField
          className={classes.formWidth}
          color="secondary"
          type="password"
          label="비밀번호"
          inputProps={{ minLength: 3, required: true, }}
          placeholder="비밀번호를 입력해주세요"
          inputRef={passwordRef}
          autoComplete="off"
        />

        {/* 로그인 실패 도움말 */}
        {helperText && helperTextValue && (
          <LoginHelper
            className={classes.upperSpace}
            text={helperTextValue}
          />
        )}

        <div className={classnames(classes.buttonset, classes.upperSpace)}>
          <Button
            variant="contained"
            color="secondary"
            className={classes.button}
            style={{ color: theme.palette.common.white }}
            type="submit"
          >
            로그인
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            className={classes.button}
            style={{ color: theme.palette.text.primary }}
            component={Link}
            to="/regist"
          >
            회원가입
          </Button>
        </div>

        <div className={classes.upperSpace}>
          <Button component={Link} to="/find-id">아이디 찾기</Button>
          |
          <Button component={Link} to="/find-pw">비밀번호 찾기</Button>
        </div>
      </form>
    </>
  );
}
