import { createContext, useContext } from 'react';

export interface PublicMypageContextState{
  userId: string;
  changeUserId: (userId: string) => void,
}

const defaultState: PublicMypageContextState = {
  userId: '',
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  changeUserId: (userId: string) => {},
};

const PublicMypageContext = createContext<PublicMypageContextState>(defaultState);

export default PublicMypageContext;

export function usePublicMypageContext(): PublicMypageContextState {
  return useContext(PublicMypageContext);
}
