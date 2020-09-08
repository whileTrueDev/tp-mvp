import React, { useCallback, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Button, TextField } from '@material-ui/core';
// import { makeStyles } from '@material-ui/core/styles';

// const useStyles = makeStyles((theme) => ({

// }));

export default function FindAccountForm(): JSX.Element {
  // const submitImpUid = useCallback(({ impUid }) => {
  //   axios.post(`${HOST}/marketer/certification`, { imp_uid: impUid })
  //     .then((res) => {
  //       const { error, data } = res.data;
  //       if (error) {
  //         alert(data.msg);
  //         handleBack();
  //       } else if (data.minor) {
  //         alert('미성년자는 이용할 수 없습니다.');
  //         handleBack();
  //       } else {
  //         alert('본인인증이 성공하였습니다.');
  //         handleNext();
  //       }
  //     })
  //     .catch(() => {
  //       alert('본인인증이 실패하였습니다.');
  //       handleBack();
  //     });
  // }, [handleBack, handleNext]);

  // useEffect(() => {
  //   if (open) {
  //     const globalParams: any = window;
  //     const { IMP } = globalParams;
  //     IMP.init('imp00026649');

  //     IMP.certification({ // param
  //       merchant_uid: 'ORD20180131-0000011',
  //       min_age: '19'
  //     }, (rsp: any) => { // callback
  //       if (rsp.success) {
  //         submitImpUid({ impUid: rsp.imp_uid });
  //       } else {
  //         handleBack();
  //       }
  //     });
  //     setOpen(0);
  //   }
  // }, [handleBack, open, setOpen, submitImpUid]);

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
        <form>
          <TextField
            // className={classes.formWidth}
            color="secondary"
            type="text"
            label="트루포인트 아이디"
            // inputRef={passwordRef}
            autoComplete="off"
            style={{ width: '100%', }}
            inputProps={{
              required: true,
              minlength: 3,
            }}
          />

          <Button
            type="submit"
            color="secondary"
            variant="contained"
            style={{
              marginTop: 16, width: '100%', padding: 16, color: 'white'
            }}
          >
            <Typography variant="body1">본인인증</Typography>
          </Button>
        </form>
      </div>

      <div style={{ marginTop: 16 }}>
        <Button component={Link} to="/login">
          로그인 하러 가기
        </Button>
      </div>
    </div>
  );
}
