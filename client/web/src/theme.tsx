import { ThemeOptions } from '@material-ui/core';
import { indigo } from '@material-ui/core/colors';
import { darken, lighten } from '@material-ui/core/styles/colorManipulator';

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
      light: lighten(indigo[400], 0.07),
      main: indigo[400],
      dark: darken(indigo[400], 0.07),
    },
    // secondary: {
    //   light: lighten(cyan[400], 0.07),
    //   main: indigo[400],
    //   dark: darken(cyan[400], 0.07),
    // },
  },
  typography: {
    fontFamily: '"NotoSansKR-Regular", "Sunflower", sans-serif'
  }
};

export default rawTheme;
