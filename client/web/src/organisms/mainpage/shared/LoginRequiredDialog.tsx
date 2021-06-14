import {
  Grid, Button, DialogProps, useMediaQuery, useTheme, Box,
} from '@material-ui/core';
import React from 'react';
import { Link } from 'react-router-dom';
import Dialog from '../../../atoms/Dialog/Dialog';
import { KakaoLoginButton, NaverLoginButton } from '../login/SNSLoginButton';

interface Props extends DialogProps{
  children?: React.ReactNode;
  open: boolean;
  onClose: () => void;
}

export default function LoginRequiredDialog(props: Props): JSX.Element {
  const { children, open, onClose } = props;

  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      title="로그인이 필요한 기능입니다"
    >
      <Grid container direction="column" justify="center">

        <Box mb={4}>
          <Grid container direction="column" justify="center">
            {children}
          </Grid>
        </Box>

        <Box mb={1}>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            component={Link}
            to="/signup"
          >
            회원가입 하러 가기
          </Button>
        </Box>

        <Box mb={2}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            component={Link}
            to="/login"
          >
            로그인 하러 가기
          </Button>
        </Box>

        <KakaoLoginButton />
        <NaverLoginButton />

      </Grid>
    </Dialog>
  );
}
