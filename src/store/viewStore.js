import { create } from "zustand";

const useViewStore = create((set) => ({
  view: "",

  setView: (view) => set({ view }),
}));

export default useViewStore;
