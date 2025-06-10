import { create } from "zustand";
import { StoreData } from "@/types";

interface StoreState {
  store: StoreData | null;
  setStore: (store: StoreData) => void;
}

export const useStoreData = create<StoreState>((set) => ({
  store: null,
  setStore: (store) => set({ store }),
}));