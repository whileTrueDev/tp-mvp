import { createContext } from 'react';

export type BoardPlatform = 'free' | 'afreeca' | 'twitch';
export interface BoardContextState{
  platform: BoardPlatform,
  changePlatform: (newPlatform: BoardPlatform) => void
}

const defaultState: BoardContextState = {
  platform: 'free',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  changePlatform: (newPlatform: BoardPlatform) => {},
};

const BoardContext = createContext<BoardContextState>(defaultState);

export default BoardContext;
