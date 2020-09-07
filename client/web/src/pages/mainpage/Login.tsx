import React, { useRef } from 'react';
import classnames from 'classnames';
import { useHistory, Link } from 'react-router-dom';
import useAxios from 'axios-hooks';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import {
  Button, Typography, TextField, useMediaQuery
} from '@material-ui/core';

import login from '../../utils/auth/login';
import host from '../../host-endpoint';
import CenterLoading from '../../atoms/Loading/CenterLoading';
import LoginHelper from '../../atoms/LoginHelper';

const useStyles = makeStyles((theme) => ({
  container: { display: 'flex', height: '100vh', },
  leftside: {
    width: '50%',
    background: `linear-gradient(${theme.palette.primary.main}, ${theme.palette.primary.light})`
  },
  centerflex: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    alignItems: 'center',
  },
  upperSpace: { marginTop: theme.spacing(4) },
  fieldWidth: { width: 300 },
  button: { width: 130, boxShadow: 'none', },
  buttonset: { display: 'flex', justifyContent: 'space-between', width: '100%' },
  helperField: {
    display: 'flex', justifyContent: 'space-between', flexDirection: 'row-reverse', width: '100%',
  },
  footer: {
    position: 'absolute',
    bottom: 20,
  },
}));

export default function Login():JSX.Element {
  const theme = useTheme();
  const history = useHistory();
  const classes = useStyles();
  const isDesktop = useMediaQuery('(min-width:768px)');

  const userIdRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [{ loading, error }, executePost] = useAxios(
    { method: 'POST', url: `${host}/auth/login` },
    { manual: true }
  );

  function handleLoginSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    if (userIdRef.current && passwordRef.current) {
      executePost({
        data: {
          userId: userIdRef.current.value,
          password: passwordRef.current.value
        }
      }).then((res) => {
        login(res.data.access_token);
        history.push('/');
      });
    }
  }

  return (
    <section className={classes.container}>
      {/* 로딩 컴포넌트 */}
      {loading && (<CenterLoading color="secondary" size="5rem" />)}

      {/* 왼쪽 빈 공간 */}
      {isDesktop && (
      <div className={classes.leftside} />
      )}

      {/* 오른쪽 로그인 공간 */}
      <div
        className={classes.centerflex}
        style={{ width: isDesktop ? '50%' : '100%' }}
      >
        <form
          onSubmit={handleLoginSubmit}
          className={classes.fieldWidth}
        >
          <Typography variant="h4">비즈니스의 시작</Typography>
          <Typography variant="h4">TRUEPOINT</Typography>

          <TextField
            className={classnames(classes.upperSpace, classes.fieldWidth)}
            color="secondary"
            type="text"
            label="아이디"
            inputRef={userIdRef}
          />
          <TextField
            className={classes.fieldWidth}
            color="secondary"
            type="password"
            label="비밀번호"
            inputRef={passwordRef}
            autoComplete="off"
          />

          {/* 로그인 실패 도움말 */}
          {error && error.response?.status !== 401 && (
            <LoginHelper
              className={classes.upperSpace}
              text="로그인 과정에서 알 수 없는 오류가 발생했습니다. support@mytruepoint.com으로 문의주세요"
            />
          )}
          {error && error.response?.status === 401 && (
            <LoginHelper
              className={classes.upperSpace}
              text="아이디 혹은 비밀번호가 일치하지 않습니다. 입력한 내용을 다시 확인해 주세요."
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
              to="/signup"
            >
              회원가입
            </Button>
          </div>

          <div className={classnames(classes.helperField, classes.upperSpace)}>
            <Button>아이디/비밀번호 찾기</Button>
          </div>
        </form>

        <div className={classnames(classes.centerflex, classes.footer)}>
          <div>
            <Button component={Link} to="/termsofuse">이용약관</Button>
            <Button component={Link} to="/privacypolicy" style={{ fontWeight: 'bold' }}>개인정보 처리방침</Button>
          </div>
          <Typography variant="caption">Copyright © WhileTrue Corp. All rights reserved.</Typography>
        </div>
      </div>
    </section>
  );
}
