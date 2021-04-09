import React, {
  useReducer, useContext, Dispatch, createContext, useState, FC,
} from 'react';

export type BoardPlatform = 'free' | 'afreeca' | 'twitch';

type State = {
  platform: BoardPlatform;
}

type Action = {type: 'SET_PLATFORM', platform: BoardPlatform};
type SampleDispatch = Dispatch<Action>;

const defaultState: State = { platform: 'free' };
// eslint-disable-next-line @typescript-eslint/no-empty-function
const defaultDispatch: SampleDispatch = (value: Action) => {
  // console.log({ value }, 'default dispatch');
};

const SampleStateContext = createContext<State>(defaultState);
const SampleDispatchContext = createContext<SampleDispatch>(defaultDispatch);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_PLATFORM':
      return {
        ...state,
        platform: action.platform,
      };
    default:
      throw new Error('unhandled action in board context reducet');
  }
}

export function SampleProvider({ children }: {children: React.ReactNode | JSX.Element}): JSX.Element {
  const [state, dispatch] = useReducer(reducer, {
    platform: 'free',
  });

  return (
    <SampleStateContext.Provider value={state}>
      <SampleDispatchContext.Provider value={dispatch}>
        {children}
      </SampleDispatchContext.Provider>
    </SampleStateContext.Provider>
  );
}

export function useSampleState(): State {
  const state = useContext(SampleStateContext);
  if (!state) throw new Error('cannot find sample provider');
  return state;
}

export function useSampleDispatch(): SampleDispatch {
  const dispatch = useContext(SampleDispatchContext);
  if (!dispatch) throw new Error('Cannot find sample provider');
  return dispatch;
}

export type BoardContextState = {
  platform: BoardPlatform,
  changePlatform: (platform: BoardPlatform) => void,
}

const boardContextDefaultValues: BoardContextState = {
  platform: 'free',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  changePlatform: (platform: BoardPlatform) => {
    // console.log('this is default value change platform');
  },
};

export const BoardContext = createContext<BoardContextState>(
  boardContextDefaultValues,
);

const BoardStateProvider: FC = ({ children }) => {
  const [platform, setPlatform] = useState<BoardPlatform>(boardContextDefaultValues.platform);

  const changePlatform = (newPlatform: BoardPlatform) => {
    // console.log('not default change platform', newPlatform);
    setPlatform(newPlatform);
  };

  const boardContextValue = {
    platform,
    changePlatform,
  };

  return (
    <BoardContext.Provider value={boardContextValue}>
      {children}
    </BoardContext.Provider>
  );
};

export default BoardStateProvider;
