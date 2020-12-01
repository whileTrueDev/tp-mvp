import React from 'react';
import {
  Card, CardContent, Button, CardActions,
} from '@material-ui/core';
import { ProviderContext } from 'notistack';
/*
 snack 함수 사용법 
 * snack은 최상위 context로 선언되어 있다.
    
 1. 사용할 컴포넌트에서 notistack의 context호출 함수 불러온다.
 > import { useSnackbar } from 'notistack';
 
 2. alert의 위치와 형태 등을 warpping해둔 함수를 불러온다.
 > import ShowSnack from '../../../../atoms/snackbar/ShowSnack';

 3. 컴포넌트 내 에서 context를 호출한다.
 > const { enqueueSnackbar } = useSnackbar(); 

 4. 필요한 곳에서 함수(ShowSnack)를 수행하고, 인자에 (<메세지>, <타입>, enqueueSnackbar)를 입력하여 사용한다.
 > ShowSnack('기간을 다시 설정해 주세요', 'error', enqueueSnackbar);
*/
const ShowDialog = (message: string, snackbarContext: ProviderContext): React.ReactText => {
  const { enqueueSnackbar, closeSnackbar } = snackbarContext;
  const showSnack = enqueueSnackbar(message, {
    content: (key: string) => (
      <Card variant="outlined">
        <CardContent>
          {message}
        </CardContent>
        <CardActions>
          <Button
            onClick={() => {
              closeSnackbar(key);
            }}
            color="primary"
          >
            Disagree
          </Button>
          <Button
            onClick={() => {
              closeSnackbar(key);
            }}
            color="primary"
          >
            Agree
          </Button>
        </CardActions>
      </Card>
    ),
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'center',
    },
    style: {
      top: '-600%',
    },
    disableWindowBlurListener: true,
    autoHideDuration: null,
  });
  return showSnack;
};

export default ShowDialog;
