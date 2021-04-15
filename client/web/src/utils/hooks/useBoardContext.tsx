import { useContext } from 'react';
import BoardContext, { BoardContextState } from '../contexts/BoardContext';

export default function useBoardContext(): BoardContextState {
  return useContext(BoardContext);
}
