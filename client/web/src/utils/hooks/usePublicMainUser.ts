import create from 'zustand';
import { persist } from "zustand/middleware"


const usePublicMainUser = create<{
  user:{userId:string};
  setUser: (userId:string) => void;
}>(persist(
  (set) => ({
    user:{
      userId: '',
    },
    setUser: (userId: string) => set((state) => ({...state, user: {userId}}))
  }),
  {
    name:'public-user-storage',
  }
))

export default usePublicMainUser;