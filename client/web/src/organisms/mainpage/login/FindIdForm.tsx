import React, { useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, TextField } from '@material-ui/core';
// import { makeStyles } from '@material-ui/core/styles';

// const useStyles = makeStyles((theme) => ({

// }));

export default function FindAccountForm(): JSX.Element {
  const [activeStep, setActiveStep] = React.useState(0);
  function handleBack() {
    setActiveStep((prev) => prev - 1);
  }
  function handleNext() {
    setActiveStep((prev) => prev + 1);
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <Typography variant="h4">TRUEPOINT LOGO</Typography>

      {/* 아이디 찾기 방법 선택 */}
      {activeStep === 0 && (
      <div style={{
        marginTop: 32,
        padding: 32,
        minWidth: 300,
        maxWidth: 500,
        border: '1px solid #ddd',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column'
      }}
      >
        <Typography variant="h6">트루포인트 아이디를 찾을</Typography>
        <Typography variant="h6">방법을 선택해 주세요.</Typography>
        <br />
        <br />
        <div>
          <Button
            onClick={() => { handleNext(); }}
            style={{ width: '100%', padding: 16, borderBottom: '1px solid #ddd' }}
          >
            <Typography variant="body1">
              이메일 및 이름으로 아이디 찾기
            </Typography>
          </Button>
          <Button
            onClick={() => { handleNext(); }}
            style={{ width: '100%', padding: 16, borderBottom: '1px solid #ddd' }}
          >
            <Typography variant="body1">
              본인인증으로 아이디 찾기
            </Typography>
          </Button>
        </div>
      </div>
      )}
      {/* 방법에 따른 정보 입력 */}
      {activeStep === 1 && (
        <div style={{
          marginTop: 32,
          padding: 32,
          minWidth: 300,
          maxWidth: 500,
          border: '1px solid #ddd',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}
        >
          <Typography variant="h6">이메일, 이름으로</Typography>
          <Typography variant="h6">아이디를 찾습니다.</Typography>
          <br />
          <Typography variant="body2">가입시 입력한 이메일과 이름으로 아이디를 찾습니다.</Typography>
          <br />
          <br />
          <form>
            <TextField
            // className={classes.formWidth}
              color="secondary"
              type="text"
              label="이름"
            // inputRef={passwordRef}
              autoComplete="off"
              style={{ width: '100%', }}
            />

            <TextField
            // className={classes.formWidth}
              color="secondary"
              type="text"
              label="이메일"
            // inputRef={passwordRef}
              autoComplete="off"
              style={{ width: '100%', }}
            />
            <Button
              variant="contained"
              color="secondary"
              style={{
                padding: 16, marginTop: 16, color: 'white', width: '100%'
              }}
              type="submit"
            >
              <Typography>
                아이디 찾기
              </Typography>
            </Button>
            <Button
              variant="contained"
              style={{
                marginTop: 16,
                padding: 16,
                width: '100%',
              }}
              onClick={handleBack}
            >
              <Typography>
                방법 선택으로 돌아가기
              </Typography>
            </Button>
          </form>
        </div>
      )}

      {/* 찾은 아이디 정보 렌더링 */}

      <div style={{ marginTop: 16 }}>
        <Button component={Link} to="/login">로그인 하러 가기</Button>
      </div>
    </div>
  );
}
