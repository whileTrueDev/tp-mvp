import React from 'react';
import classnames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import {
  Button, Typography
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import useAxios from 'axios-hooks';

import useIamportCertification from '../../../utils/hooks/useIamportCertification';

interface Props {
  handleBack: () => void;
  handleNext: () => void;
  setCertificationInfo: React.Dispatch<React.SetStateAction<any>>;
}

const useStyles = makeStyles((theme) => ({
  box: {
    padding: `${theme.spacing(8)}px ${theme.spacing(4)}px`,
    minWidth: 300,
    maxWidth: 700,
    border: `1px solid ${theme.palette.divider}`,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  center: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column'
  },
  subcontent: { marginTop: theme.spacing(2) },
  content: { width: '100%', marginTop: theme.spacing(4), },
  fullButton: {
    padding: theme.spacing(2), marginTop: theme.spacing(2), width: '100%'
  },
  inputField: { width: '100%' },
}));

// 마케터 유형을 선택하고 난 뒤 rendering되는 컴포넌트.
// { birth: "1994-01-19"
// gender: "male"
// name: "박찬우"
// userDI: "MC0GCCqGSIb3DQIJAyEALtvz1KBXoJz4NUCTW0Zw7zxShHoci+ISG9RrmmUViZc=" }

// 본인인증으로 ID를 조회하는 요청을 한 번 더 거친다.
function IndentityVerification({
  handleBack,
  handleNext,
  setCertificationInfo
}: Props): JSX.Element {
  const classes = useStyles();
  const history = useHistory();
  const [, getRequest] = useAxios(
    '/auth/certification', { manual: true }
  );
  const [, checkIdRequest] = useAxios(
    '/users/check-id', { manual: true }
  );

  const iamport = useIamportCertification((impUid) => {
    // iamport 본인인증 이후 실행될 Id 조회 함수
    getRequest({
      params: { impUid }
    }).then((res) => {
      if (res.data) {
        // 기존의 가입된 내역이 존재할 경우, 넘길 수 있도록 변경한다.
        checkIdRequest({
          params: { userDI: res.data.userDI }
        }).then((inres) => {
          if (inres.data) {
            // 회원가입한 ID가 존재한다.
            alert('기존에 가입된 ID가 존재합니다. ID 찾기로 이동합니다.');
            history.replace('/find-id');
          } else {
            setCertificationInfo(res.data);
            handleNext();
          }
        });
      } else {
        // 에러일 가능성이 존재한다.
        handleBack();
      }
    }).catch(() => { handleBack(); });
  });

  return (
    <div className={classnames(classes.box, classes.content)}>
      <Typography variant="h5">본인인증</Typography>
      <Typography variant="h6">회원가입을 위해 본인인증을 실시합니다.</Typography>
      <div className={classes.content}>
        <Typography align="right">본인인증 시 제공되는 정보는 해당 인증기관에서 직접 수집하며,</Typography>
        <Typography align="left">인증 이외의 용도로 이용 또는 저장하지 않습니다.</Typography>
      </div>
      <div className={classnames(classes.center, classes.content)}>
        <Button
          variant="contained"
          color="secondary"
          style={{ color: 'white' }}
          className={classes.fullButton}
          onClick={() => {
            iamport.startCert();
          }}
        >
          <Typography>다음</Typography>
        </Button>
        <Button
          // onClick={handleBack}
          className={classes.fullButton}
        >
          <Typography>뒤로</Typography>
        </Button>
      </div>
    </div>
  );
}

export default IndentityVerification;
