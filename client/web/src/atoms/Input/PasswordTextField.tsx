import React, { useState } from 'react';
import {
  IconButton, InputAdornment, TextField, OutlinedTextFieldProps, InputLabel,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

export type PasswordTextFieldProps = OutlinedTextFieldProps;
export default function PasswordTextField(props: PasswordTextFieldProps): JSX.Element {
  const { label, style, ...rest } = props;
  const [visibility, setVisibility] = useState(false);
  function handlePasswordVisibility() {
    setVisibility((prev) => !prev);
  }
  return (
    <>
      <InputLabel shrink>{label}</InputLabel>
      <TextField
        style={{ marginTop: 0, ...style }}
        margin="dense"
        size="small"
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
        {...rest}
      />
    </>
  );
}
