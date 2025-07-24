"use client";
import { useEffect } from "react";
import { useStoreData } from "@/store/useStoreData";
import { StoreData } from "@/types";
import { authClient } from "@/lib/auth-client";

// For a single store
export function StoreInitializer({ store }: { store: StoreData }) {
  const setStore = useStoreData((state) => state.setStore);

  useEffect(() => {
    setStore(store);
  }, [store, setStore]);

  return null;
}

// For multiple stores
export function StoresInitializer() {
  const setStores = useStoreData((state) => state.setStores);
  const setSelectedStoreId = useStoreData((state) => state.setSelectedStoreId);
  const selectedStoreId = useStoreData((state) => state.selectedStoreId);

  useEffect(() => {
    async function fetchStores() {
      const { data: session } = await authClient.getSession();
      const userId = session?.user?.id;
      if (!userId) return;
      const res = await fetch(`/api/store?owner=${userId}`);
      if (!res.ok) return;
      const stores = await res.json();
      setStores(stores);
      if (stores.length > 0 && !selectedStoreId) {
        setSelectedStoreId(stores[0].id);
      }
    }
    fetchStores();
  }, []);

  return null;
}
