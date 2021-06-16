import React from 'react';
import Stepper from '../../organisms/mainpage/regist/Stepper';
import LoginCommonLayout from '../../organisms/mainpage/login/LoginCommonLayout';

export default function Login(): JSX.Element {
  return (
    <LoginCommonLayout
      footer={false}
    >
      <Stepper />

    </LoginCommonLayout>
  );
}
