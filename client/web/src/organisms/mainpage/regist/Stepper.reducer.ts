export interface StepState {
  passwordValue: string | number;
  id: string | boolean; // idValue 는 input에 들어오는 string 저장, id는 string값이 유효한지
  idValue: string;
  password: boolean;
  repasswd: boolean;
  checkDuplication: boolean; // id 중복여부 - true이면 중복임, false면 중복아님
  email: string;
  phoneNum: string | number;
  name: string;
  emailVerified: boolean; // 이메일 인증코드 확인 pass 여부 - true이면 이메일인증 완료 / false이면 미인증 혹은 pass못함
  isValidEmail: boolean; // 유효한 이메일 주소인지 확인여부 - true 이면 유효한 이메일, false이면 유효하지 않은 이메일
  nickname: string;
  passEmailDuplication: boolean; // 이메일 중복 여부 - true이면 중복확인 완료 && 중복안됨,  false 이면 중복 혹은 중복미확인
  isNicknameDuplicated: boolean; // 닉네임 중복 여부 - true이면 닉네임 중복이거나 확인 안함, false 이면 중복안됨
}

export const initialState: StepState = {
  passwordValue: '',
  id: false,
  password: false,
  repasswd: false,
  checkDuplication: true,
  email: '',
  phoneNum: '',
  name: '',
  nickname: '',
  idValue: '',
  emailVerified: false,
  isValidEmail: false,
  passEmailDuplication: false,
  isNicknameDuplicated: true,
};

export type StepAction = { type: 'id'; value: string }
  | { type: 'password'; value: string }
  | { type: 'repasswd'; value: string }
  | { type: 'email'; value: string }
  | { type: 'phoneNum'; value: string | number }
  | { type: 'checkDuplication'; value: boolean }
  | { type: 'name'; value: string }
  | { type: 'reset' }
  | { type: 'nickname'; value: string }
  | { type: 'verifyEmail'; value: boolean}
  | { type: 'passEmailDuplication'; value: boolean}
  | { type: 'isNicknameDuplicated'; value: boolean}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// reducer를 사용하여 Error를 handling하자
export function myReducer(
  state: StepState,
  action: StepAction,
): StepState {
  switch (action.type) {
    case 'id': {
      const idReg = /^[A-za-z]{1}[a-z0-9]{5,14}$/g;
      if (idReg.test(action.value)) {
        return {
          ...state, id: false, checkDuplication: true, idValue: action.value,
        };
      }
      return {
        ...state, id: true, checkDuplication: true, idValue: action.value,
      };
    }
    // (?=.*[0-9])
    case 'password': {
      const regx = /^(?=.*[a-zA-Z0-9]).{8,20}$/;
      if (regx.test(action.value)) {
        return { ...state, passwordValue: action.value, password: false };
      }
      return { ...state, passwordValue: action.value, password: true };
    }
    case 'repasswd': {
      if (state.passwordValue === action.value) {
        return { ...state, repasswd: false };
      }
      return { ...state, repasswd: true };
    }
    case 'email': {
      return { ...state, email: action.value, isValidEmail: isValidEmail(action.value) };
    }
    case 'phoneNum': {
      return { ...state, phoneNum: action.value };
    }
    case 'name': {
      return { ...state, name: action.value };
    }
    case 'nickname': {
      return {
        ...state,
        nickname: action.value,
        name: action.value, // 웹 회원가입 화면에서 이름 입력칸 주석처리 -> 이름 컬럼에 별명과 같은 값이 입력되도록 함
        isNicknameDuplicated: true, // 입력된 닉네임 변경시 중복확인 다시하도록 함
      };
    }
    case 'checkDuplication': {
      return { ...state, checkDuplication: action.value };
    }
    case 'reset': {
      return initialState;
    }
    case 'verifyEmail': {
      return { ...state, emailVerified: action.value };
    }
    case 'passEmailDuplication': {
      return { ...state, passEmailDuplication: action.value };
    }
    case 'isNicknameDuplicated': {
      return { ...state, isNicknameDuplicated: action.value };
    }
    default: {
      return state;
    }
  }
}

export default { myReducer, initialState };
