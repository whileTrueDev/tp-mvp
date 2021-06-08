import React from 'react';
import LoginForm from '../../organisms/mainpage/login/LoginForm';
import LoginCommonLayout from '../../organisms/mainpage/login/LoginCommonLayout';

export default function Login(): JSX.Element {
  return (
    <LoginCommonLayout>
      <LoginForm />
    </LoginCommonLayout>
  );
}
