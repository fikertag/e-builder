import { create } from "zustand";
import { StoreData } from "@/types";

interface StoreState {
  stores: StoreData[]; // for dashboard
  store: StoreData | null; // for subdomain or selected store
  selectedStoreId: string | null;
  storeStatus: "idle" | "loading" | "empty" | "ready" | "error";
  setStoreStatus: (
    status: "idle" | "loading" | "empty" | "ready" | "error"
  ) => void;

  setStores: (stores: StoreData[]) => void;
  setStore: (store: StoreData) => void;
  setSelectedStoreId: (id: string | null) => void;
  updateStore: (updatedStore: StoreData) => void;
}

export const useStoreData = create<StoreState>((set) => ({
  stores: [],
  store: null,
  selectedStoreId: null,
  storeStatus: "idle",
  setStoreStatus: (status) => set({ storeStatus: status }),
  setStores: (stores) => set({ stores }),
  setStore: (store) => set({ store }),
  setSelectedStoreId: (id) => set({ selectedStoreId: id }),
  updateStore: (updatedStore) => {
    set((state) => {
      const newStores = state.stores.map((s) =>
        s.id === updatedStore.id ? updatedStore : s
      );
      console.log("Updated stores:", newStores);
      return { stores: newStores };
    });
  },
}));
