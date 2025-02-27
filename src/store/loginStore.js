import { create } from "zustand";

const useLogInStore = create((set) => ({
  isLoggedIn: false,

  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
}));

export default useLogInStore;
