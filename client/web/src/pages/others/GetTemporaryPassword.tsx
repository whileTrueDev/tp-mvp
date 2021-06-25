import React, { useRef, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import { Button, TextField, Typography } from '@material-ui/core';
import classnames from 'classnames';
import TruepointLogo from '../../atoms/TruepointLogo';
import LoginHelper from '../../atoms/LoginHelper';
import axios from '../../utils/axios';
import RegularButton from '../../atoms/Button/Button';
import { LOGIN_PAGE_LOGO_SIZE } from '../../assets/constants';

const useStyles = makeStyles((theme) => ({
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    padding: `${theme.spacing(4)}px ${theme.spacing(4)}px`,
    maxWidth: 500,
    border: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  subcontent: { marginTop: theme.spacing(1) },
  content: { width: '100%', marginTop: theme.spacing(2) },
  selectButton: { width: '100%', padding: 16, borderBottom: `1px solid ${theme.palette.divider}` },
  fullButton: {
    padding: theme.spacing(1), marginTop: theme.spacing(1.5), width: '100%',
  },
  inputField: { width: '100%' },
  helper: { marginTop: 32, minWidth: 300, maxWidth: 500 },
}));

export default function GetTemporaryPassword(): JSX.Element {
  const classes = useStyles();
  const [buttonLoadState, setButtonLoadState] = useState<boolean>(false);

  // 에러 알림창 렌더링을 위한 스테이트
  const [helperText, setHelperOpen] = React.useState<string>();
  function handleHelperOpen(errorMessage: string): void {
    setHelperOpen(errorMessage);
  }
  function handleHelperClose(): void {
    setHelperOpen(undefined);
  }

  // **************************************************
  // inputRef
  const userIdRef = useRef<HTMLInputElement>(null);
  const usernameRef = useRef<HTMLInputElement>(null);
  const usermailRef = useRef<HTMLInputElement>(null);

  // **************************************************
  // 임시 비밀번호 발급 요청
  const requestTemporaryPassword = async ({ id, name, email }: {
    id: string, name: string, email: string
  }) => {
    setButtonLoadState(true);
    handleHelperClose();
    /**
     * 아이디, 이름, 이메일로 회원정보 검색
     * 존재하지 않는 회원인경우 에러메시지 보여주기
     */
    try {
      const checkUserResponse = await axios.get('/users/check-exist-user', {
        params: {
          id, name, email,
        },
      });
      const userExist = checkUserResponse.data;
      if (!userExist) {
        handleHelperOpen('존재하지 않는 회원입니다. 아이디, 이름, 이메일을 다시 확인 해주세요');
        return;
      }
    } catch (userExistError) {
      setButtonLoadState(false);
      console.error(userExistError);
    }

    /** 존재하는 회원인 경우 해당 이메일로 임시 비밀번호 발송
     * 비밀번호 수정,
     * 로그인 후 비밀번호 수정 유도하기
     */
    try {
      const response = await axios.get('/auth/email/temporary-password', {
        params: {
          id, email,
        },
      });
      const result = response.data;
      if (result) {
        alert(`${email}로 임시 비밀번호가 발급되었습니다. 로그인 후 비밀번호를 변경해주세요.`);
      } else {
        handleHelperOpen('회원 정보를 찾을 수 없습니다. 고객센터로 문의 바랍니다.');
        return;
      }
      setButtonLoadState(false);
    } catch (emailError) {
      setButtonLoadState(false);
      console.error(emailError);
    }
  };

  // **************************************************
  // 폼 제출 submit 핸들러
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!userIdRef.current || !usernameRef.current || !usermailRef.current) {
      return;
    }
    const id = userIdRef.current.value.trim();
    const name = usernameRef.current.value.trim();
    const email = usermailRef.current.value.trim();

    if (!id || !name || !email) {
      handleHelperOpen('아이디, 이름, 이메일을 입력해주세요');
      return;
    }

    requestTemporaryPassword({ id, name, email });
  };

  return (
    <div className={classes.wrapper}>
      <TruepointLogo width={LOGIN_PAGE_LOGO_SIZE} />

      <div className={classnames(classes.box, classes.content)}>
        <Typography variant="h6">회원 아이디와</Typography>
        <Typography variant="h6">가입 시 사용한 이메일, 이름을 입력해주세요</Typography>
        <Typography className={classes.subcontent} variant="body2">
          가입시 입력한 이메일로 임시 비밀번호를 발송합니다.
        </Typography>
        <Typography className={classes.subcontent} variant="body2">
          아이디가 기억나지 않으신다면
          {' '}
          <Link to="/find-id">아이디 찾으러 가기 &gt;</Link>
        </Typography>

        <form className={classes.content} onSubmit={handleSubmit}>
          <TextField
            name="id"
            color="primary"
            type="text"
            label="아이디"
            inputRef={userIdRef}
            autoComplete="off"
            className={classes.inputField}
            inputProps={{ required: true }}
          />
          <TextField
            name="name"
            color="primary"
            type="text"
            label="이름"
            inputRef={usernameRef}
            autoComplete="off"
            className={classes.inputField}
            inputProps={{ required: true, minLength: 3 }}
          />
          <TextField
            name="email"
            color="primary"
            type="email"
            label="이메일"
            inputRef={usermailRef}
            autoComplete="off"
            className={classes.inputField}
            inputProps={{ required: true }}
          />
          {helperText && (
          <div className={classes.helper}>
            <LoginHelper text={helperText} />
          </div>
          )}

          <RegularButton
            variant="contained"
            color="primary"
            className={classes.fullButton}
            style={{ color: 'white' }}
            type="submit"
            load={buttonLoadState}
          >
            <Typography>임시 비밀번호 받기</Typography>
          </RegularButton>

        </form>

        <Button
          className={classes.fullButton}
          variant="contained"
          component={Link}
          to="/login"
        >
          로그인 하러 가기

        </Button>
      </div>

    </div>
  );
}
