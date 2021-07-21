import create from 'zustand';
import { persist } from 'zustand/middleware';

interface PublicMainUserState {
  user: {
    userId: string,
  },
  setUser: (userId: string) => void
}
const usePublicMainUser = create<PublicMainUserState>(persist(
  (set) => ({
    user: {
      userId: '',
    },
    setUser: (userId: string) => set((state) => ({ ...state, user: { userId } })),
  }),
  {
    name: 'public-user-storage',
  },
));

export default usePublicMainUser;
