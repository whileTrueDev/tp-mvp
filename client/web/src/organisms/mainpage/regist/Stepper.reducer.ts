export const initialState = {
  passwordValue: '',
  id: false,
  password: false,
  repasswd: false,
  checkDuplication: true,
  email: '',
  phoneNum: '',
  domain: '',
  name: '',
  idValue: '',
};

export interface StepState {
  passwordValue: string | number;
  id: string | boolean;
  idValue: string;
  password: boolean;
  repasswd: boolean;
  checkDuplication: boolean;
  email: string;
  phoneNum: string | number;
  domain: string;
  name: string;
}

export type StepAction = { type: 'id'; value: string }
  | { type: 'password'; value: string }
  | { type: 'repasswd'; value: string }
  | { type: 'email'; value: string }
  | { type: 'phoneNum'; value: string | number }
  | { type: 'domain'; value: string }
  | { type: 'checkDuplication'; value: boolean }
  | { type: 'name'; value: string }
  | { type: 'reset' }

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
      const regx = /^(?=.*[a-zA-Z0-9])(?=.*[!@#$%^*+=-]).{8,20}$/;
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
      if (action.value.length <= 15) {
        return { ...state, email: action.value };
      }
      return { ...state };
    }
    case 'phoneNum': {
      return { ...state, phoneNum: action.value };
    }
    case 'domain': {
      return { ...state, domain: action.value };
    }
    case 'name': {
      return { ...state, name: action.value };
    }
    case 'checkDuplication': {
      return { ...state, checkDuplication: action.value };
    }
    case 'reset': {
      return initialState;
    }
    default: {
      return state;
    }
  }
}

export default { myReducer, initialState };
