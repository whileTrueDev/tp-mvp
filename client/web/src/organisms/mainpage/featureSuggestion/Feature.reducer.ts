/* eslint-disable import/prefer-default-export */
export const initialState = {
  title: '',
  category: '',
  contents: '',
  image: ''
};

export interface InputState {
  title: string;
  category: string;
  contents: string;
  image: string;
}

export function featureReducer(action: any, state: InputState) {
  switch (action.type) {
    case 'title': {
      if (action.value) {
        return {
          ...state, value: action.value
        };
      }
      return {
        ...state, id: true, checkDuplication: true, idValue: action.value
      };
    }
    default: { }
  }
}
