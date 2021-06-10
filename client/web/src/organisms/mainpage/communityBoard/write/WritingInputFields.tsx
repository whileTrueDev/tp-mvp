import { Grid } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import React from 'react';
import useMediaSize from '../../../../utils/hooks/useMediaSize';
import InputField from './InputField';

const useStyles = makeStyles((theme: Theme) => createStyles({
  input: { marginBottom: theme.spacing(1) },
}));

export default function WritingInputFields({
  isEditMode,
  nicknameRef,
  passwordRef,
  titleRef,
}: {
  isEditMode: boolean,
  nicknameRef: React.RefObject<HTMLInputElement>,
  passwordRef: React.RefObject<HTMLInputElement>,
  titleRef: React.RefObject<HTMLInputElement>
}): JSX.Element {
  const { isMobile } = useMediaSize();
  const classes = useStyles();
  const getTextFieldOptions = (label: string, maxLen: number) => ({
    maxLength: maxLen,
    label: isMobile ? undefined : label,
    helperText: isMobile ? undefined : `* ${label} - 최대 12글자까지 가능합니다`,
    placeholder: isMobile ? label : `${label} 입력해주세요`,
  });

  return (
    <>

      <InputField
        name="title"
        inputRef={titleRef}
        {...getTextFieldOptions('제목', 20)}
        className={classes.input}
      />
      {isEditMode
        ? null
        : (
          <Grid
            container
            justify="flex-start"
            spacing={2}
          >
            <Grid item xs={6}>
              <InputField
                name="nickname"
                inputRef={nicknameRef}
                {...getTextFieldOptions('닉네임', 12)}
                className={classes.input}
              />
            </Grid>
            <Grid item xs={6}>
              <InputField
                type="password"
                name="password"
                InputLabelProps={{
                  shrink: true,
                }}
                inputRef={passwordRef}
                {...getTextFieldOptions('비밀번호', 4)}
                className={classes.input}
              />
            </Grid>
          </Grid>
        )}

    </>
  );
}
