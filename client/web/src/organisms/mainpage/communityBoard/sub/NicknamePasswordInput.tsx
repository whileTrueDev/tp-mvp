import { TextField } from '@material-ui/core';
import React from 'react';

export default function NicknamePasswordInput(
  {
    nicknameRef, passwordRef,
  }: {
    nicknameRef: any;
    passwordRef: any;
  },
): JSX.Element {
  return (
    <div>
      <TextField
        variant="outlined"
        label="닉네임"
        name="nickname"
        inputRef={nicknameRef}
        inputProps={{ maxLength: 12 }}
      />
      <TextField
        variant="outlined"
        type="password"
        name="password"
        label="비밀번호"
        inputRef={passwordRef}
        inputProps={{ maxLength: 4 }}
      />
    </div>
  );
}
