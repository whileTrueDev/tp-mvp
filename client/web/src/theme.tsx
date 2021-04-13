import { ThemeOptions } from '@material-ui/core';
// import { darken, lighten } from '@material-ui/core/styles/colorManipulator';
import blueGrey from '@material-ui/core/colors/blueGrey';

const rawTheme: ThemeOptions = {
  palette: {
    /**
     * whiletrue 디자이너가 설정한 색상으로 오버라이딩 하여야 합니다.
     * '#fff' 와 같은 하드코딩 형태로 색상을 지정하기 보다, material-ui에서 제공하는 color를 사용합니다.
     * 
     * material-ui 의 컬러는 내부 폰트의 색상의 변화에 대한 값을 내포하고 있습니다.
     * https://material-ui.com/customization/color/#color 에서 Color를 찾을 수 있습니다.
     */

    primary: {
      light: '#fcf3c3',
      main: '#f29551',
      dark: '#ff5400',
      contrastText: '#fff',
    },

    secondary: {
      light: '#cedfff',
      main: '#216eff',
      // dark: darken('#79e2e0', 0.1),
      contrastText: '#fff',
    },
    // 파랑 계열 색상
    info: {
      light: '#9AA2C5',
      main: blueGrey[400],
      dark: blueGrey[600],
    },
    // 레드 계열 색상
    error: {
      light: '#F0A9B3',
      main: '#FF3E7A',
    },
    // 초록 계열 색상
    // success: { },
    // // 주황 계열 색상
    // warn : { },
    // }
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      'AppleSDGothicNeoR',
      '"Noto Sans KR"',
      '"Roboto"',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    fontSize: 14,
    htmlFontSize: 16,
  },
};

export default rawTheme;
