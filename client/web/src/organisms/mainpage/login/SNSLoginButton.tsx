import { Button, Typography } from '@material-ui/core';
import React from 'react';
import { getApiHost } from '../../../utils/getApiHost';

export function KakaoLoginButton(): JSX.Element {
  return (
    <Button
      fullWidth
      variant="contained"
      href={`${getApiHost()}/auth/kakao`}
      style={{
        backgroundColor: '#FEE500', padding: 0, marginBottom: '8px',
      }}
    >
      <span style={{ padding: '6px', display: 'flex' }}>
        <img
          src="/images/logo/kakao.png"
          alt="카카오"
          width="24"
          height="24"
        />
      </span>

      <Typography variant="button">카카오 아이디로 로그인</Typography>

    </Button>
  );
}

export function NaverLoginButton(): JSX.Element {
  return (
    <Button
      fullWidth
      variant="contained"
      href={`${getApiHost()}/auth/naver`}
      style={{ backgroundColor: '#03c75a', padding: 0 }}
    >
      <img
        src="/images/logo/naver.png"
        alt="네이버"
        width="36"
        height="36"
      />
      <Typography variant="button" style={{ color: 'white' }}>네이버 아이디로 로그인</Typography>

    </Button>
  );
}
