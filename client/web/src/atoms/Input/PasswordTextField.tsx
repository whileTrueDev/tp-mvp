import React, { useState } from 'react';
import {
  IconButton, InputAdornment, TextField, TextFieldProps,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

export type PasswordTextFieldProps = TextFieldProps;
export default function PasswordTextField(props: PasswordTextFieldProps): JSX.Element {
  const [visibility, setVisibility] = useState(false);
  function handlePasswordVisibility() {
    setVisibility((prev) => !prev);
  }
  return (
    <TextField
      type={visibility ? 'text' : 'password'}
      autoComplete="off"
      inputProps={{ required: true, minLength: 8, maxLength: 16 }}
      // eslint-disable-next-line react/jsx-no-duplicate-props
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handlePasswordVisibility}>
              {visibility ? <Visibility /> : <VisibilityOff />}
            </IconButton>
          </InputAdornment>),
      }}
      {...props}
    />
  );
}
