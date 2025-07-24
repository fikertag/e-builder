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
  const setStoreStatus = useStoreData((state) => state.setStoreStatus);

  useEffect(() => {
    let isMounted = true;
    setStoreStatus("loading");
    async function fetchStores() {
      try {
        const { data: session } = await authClient.getSession();
        const userId = session?.user?.id;
        if (!userId) {
          setStoreStatus("error");
          return;
        }
        const res = await fetch(`/api/store?owner=${userId}`);
        if (!res.ok) {
          setStoreStatus("error");
          return;
        }
        const stores = await res.json();
        if (isMounted) {
          setStores(stores);
          if (stores.length > 0) {
            setSelectedStoreId(stores[0].id);
            setStoreStatus("ready");
          } else {
            setSelectedStoreId(null);
            setStoreStatus("empty");
          }
        }
      } catch (err) {
        setStoreStatus(err ? "error" : "error");
      }
    }
    fetchStores();
    return () => {
      isMounted = false;
    };
  }, []);

  return null;
}
