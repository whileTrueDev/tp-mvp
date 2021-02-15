import { Grid } from '@material-ui/core';
import React from 'react';
import InputField from './InputField';

export default function NicknamePasswordInput(
  {
    nicknameValue, passwordValue,
    onPasswordChange, onNicknameChange,
  }: {
    nicknameValue: string;
    passwordValue: string;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onNicknameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
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
          maxLength={12}
          helperText="* 닉네임은 최대 12글자까지 가능합니다"
          placeholder="닉네임을 입력하세요"
          value={nicknameValue}
          onChange={onNicknameChange}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <InputField
          type="password"
          name="password"
          label="비밀번호"
          maxLength={4}
          InputLabelProps={{
            shrink: true,
          }}
          helperText="* 비밀번호는 최대 4글자까지 가능합니다"
          placeholder="비밀번호를 입력하세요"
          value={passwordValue}
          onChange={onPasswordChange}
        />
      </Grid>
    </Grid>
  );
}
