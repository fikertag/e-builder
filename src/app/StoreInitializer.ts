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

  useEffect(() => {
    setStores(stores);
  }, [stores, setStores]);

  return null;
}
