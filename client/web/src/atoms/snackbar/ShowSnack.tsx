import React from 'react';
import Alert from '@material-ui/lab/Alert';
import Fade from '@material-ui/core/Fade';
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

const ShowSnack = (message: string, type: 'success' | 'info' | 'warning' | 'error',
  enqueueSnackbar: (m: React.ReactNode, options?: any) => React.ReactText,
  location?: 'top'| 'bottom'): React.ReactText => {
  // top, bottom을 추가하여 우선순위에 따라 위치를 변경할 수 있도록 한다.
  // transition을 Fade로 변경한다.
  const locationType = (location === 'top') ? {
    anchorOrigin: {
      vertical: 'top',
      horizontal: 'right',
    },
    style: {
      top: '158%',
    },
  } : {
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'center',
    },
  };

  const showSnack = enqueueSnackbar(message, {
    content: (key: string) => (
      <Alert
        severity={type}
        color={type}
        style={{
          fontWeight: 700,
        }}
      >
        {message}
      </Alert>
    ),
    // anchorOrigin,
    TransitionComponent: Fade,
    autoHideDuration: 1500,
    ...locationType,
  });
  return showSnack;
};
export default ShowSnack;
