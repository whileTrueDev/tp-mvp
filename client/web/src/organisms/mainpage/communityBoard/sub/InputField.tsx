import { TextField, OutlinedTextFieldProps } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import React from 'react';

interface PropType extends Partial<OutlinedTextFieldProps>{
  maxLength?: number;
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  input: {
    marginBottom: theme.spacing(2),
  },
}));

/**
 * 글 작성/수정시
 * 이름, 비밀번호, 제목 쓰는 TextField 컴포넌트
 * @param props 
 */
export default function InputField(props: PropType): JSX.Element {
  const {
    maxLength, inputProps, className, ...rest
  } = props;
  const classes = useStyles();
  return (
    <TextField
      {...rest}
      className={`${classes.input} ${className}`}
      variant="outlined"
      inputProps={{ ...inputProps, maxLength }}
      InputLabelProps={{
        shrink: true,
      }}
      required
      fullWidth
    />
  );
}
