import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, TextField } from '@material-ui/core';
// import { makeStyles } from '@material-ui/core/styles';

// const useStyles = makeStyles((theme) => ({

// }));

export default function FindAccountForm(): JSX.Element {
  return (
    <div style={{ textAlign: 'center' }}>
      <Typography variant="h4">TRUEPOINT LOGO</Typography>

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
        <br />
        <Typography variant="h6">트루포인트 비밀번호를 찾기 위해</Typography>
        <Typography variant="h6">본인인증을 진행해 주세요.</Typography>
        <br />
        <br />
        <div style={{ width: '100%', }}>
          <Button
            color="secondary"
            variant="contained"
            style={{
              marginTop: 16, width: '100%', padding: 16, color: 'white'
            }}
          >
            <Typography variant="body1">본인인증</Typography>
          </Button>
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <Button component={Link} to="/login">로그인 하러 가기</Button>
      </div>
    </div>
  );
}
