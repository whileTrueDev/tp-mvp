import { CircularProgress } from '@material-ui/core';
// import useTheme from '@material-ui/core/styles/useTheme';
import React from 'react';
// import TruepointLogo from '../../../atoms/TruepointLogo';
// import TruepointLogoLight from '../../../atoms/TruepointLogoLight';

export default function MypageLoading(): JSX.Element {
  // token이 아직 없거나, refresh-token을 통해 새로운 access_token을 받아오고 있는 경우에 보여질 로딩 페이지
  // 짧아서, 기존의 LoadingComponent는 사용이 불가한 듯 보인다. 그냥 로고만 띡 나오는 지금도 나쁘지는 않은 듯.
  // @by dan, @when 2020. 11. 04.

  // Lottie + bodymovin 활용하여 after effect 애니메이션을 입힌 트루포인트 로고를 circular progress 대신 사용하는 것도 좋을 것 같다.
  // https://airbnb.io/lottie/#/

  // const theme = useTheme();
  return (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}
    >
      <CircularProgress />
      {/* 로고 활용시 */}
    </div>
  );
}
