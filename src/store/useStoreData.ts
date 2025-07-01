import { create } from "zustand";
import { StoreData } from "@/types";

interface StoreState {
  stores: StoreData[]; // for dashboard
  store: StoreData | null; // for subdomain or selected store
  setStores: (stores: StoreData[]) => void;
  setStore: (store: StoreData) => void;
}

export const useStoreData = create<StoreState>((set) => ({
  stores: [],
  store: null,
  setStores: (stores) => set({ stores }),
  setStore: (store) => set({ store }),
}));
