import React from 'react';
import FindIdForm from '../../organisms/mainpage/login/FindIdForm';
import LoginCommonLayout from '../../organisms/mainpage/login/LoginCommonLayout';

export default function FindId(): JSX.Element {
  return (
    <LoginCommonLayout>
      <FindIdForm />
    </LoginCommonLayout>
  );
}
