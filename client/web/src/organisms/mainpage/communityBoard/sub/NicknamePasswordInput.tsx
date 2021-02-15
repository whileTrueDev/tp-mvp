import { Grid, TextField } from '@material-ui/core';
import React from 'react';
import InputField from './InputField';

export default function NicknamePasswordInput(
  {
    nicknameRef, passwordRef,
  }: {
    nicknameRef: any;
    passwordRef: any;
  },
): JSX.Element {
  return (

    <Grid
      container
      justify="flex-start"
      spacing={2}
    >
      <Grid item xs={12} md={6}>
        <InputField
          label="닉네임"
          name="nickname"
          inputRef={nicknameRef}
          maxLength={12}
          helperText="* 닉네임은 최대 12글자까지 가능합니다"
          placeholder="닉네임을 입력하세요"
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <InputField
          type="password"
          name="password"
          label="비밀번호"
          inputRef={passwordRef}
          maxLength={4}
          InputLabelProps={{
            shrink: true,
          }}
          helperText="* 비밀번호는 최대 4글자까지 가능합니다"
          placeholder="비밀번호를 입력하세요"
        />
      </Grid>
    </Grid>
  );
}
