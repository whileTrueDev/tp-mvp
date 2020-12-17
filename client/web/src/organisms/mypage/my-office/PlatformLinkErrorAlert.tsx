import { Button, Typography } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React from 'react';
import kakaoChattingURL from '../../../constants/kakao';

export interface PlatformLinkErrorAlertProps {
  text: string;
  onConfirmClick: () => void;
}
export default function PlatformLinkErrorAlert({
  text, onConfirmClick,
}: PlatformLinkErrorAlertProps): JSX.Element {
  return (
    <Alert severity="error">
      <Typography variant="body2">{text}</Typography>
      <Typography variant="body2">자신의 아프리카/트위치/유튜브 계정이 타인의 아이디에 잘못 연동되어 있는 경우 문의바랍니다.</Typography>
      <Button
        style={{ margin: 8 }}
        onClick={() => {
          window.open(kakaoChattingURL); // 카카오 문의로 연결 필요
        }}
        size="small"
        color="primary"
        variant="contained"
      >
        문의하기
      </Button>
      <Button
        style={{ margin: 8 }}
        onClick={() => {
          onConfirmClick();
        }}
        size="small"
        color="primary"
        variant="contained"
      >
        확인
      </Button>
    </Alert>
  );
}
