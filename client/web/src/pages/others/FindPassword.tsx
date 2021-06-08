import React from 'react';
// import FindPasswordForm from '../../organisms/mainpage/login/FindPasswordForm';
import LoginCommonLayout from '../../organisms/mainpage/login/LoginCommonLayout';
import GetTemporaryPassword from './GetTemporaryPassword';

export default function FindAuth(): JSX.Element {
  return (
    <LoginCommonLayout>
      {/* 휴대폰 본인인증을 통한 비밀번호 찾기 */}
      {/* <FindPasswordForm /> */}
      <GetTemporaryPassword />
    </LoginCommonLayout>
  );
}
