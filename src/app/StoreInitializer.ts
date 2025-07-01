"use client";
import { useEffect } from "react";
import { useStoreData } from "@/store/useStoreData";
import { StoreData } from "@/types";

// For a single store
export function StoreInitializer({ store }: { store: StoreData }) {
  const setStore = useStoreData((state) => state.setStore);

  useEffect(() => {
    setStore(store);
  }, [store, setStore]);

  return null;
}

// For multiple stores
export function StoresInitializer({ stores }: { stores: StoreData[] }) {
  const setStores = useStoreData((state) => state.setStores);
  const setSelectedStoreId = useStoreData((state) => state.setSelectedStoreId);
  const selectedStoreId = useStoreData((state) => state.selectedStoreId);

  useEffect(() => {
    setStores(stores);
    if (stores.length > 0 && !selectedStoreId) {
      setSelectedStoreId(stores[0].id);
    }
  }, [stores, setStores, setSelectedStoreId, selectedStoreId]);

  return null;
}
