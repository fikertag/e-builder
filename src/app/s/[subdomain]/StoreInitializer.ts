"use client";
import { useEffect } from "react";
import { useStoreData } from "@/store/useStoreData";
import { StoreData } from "@/types";

export default function StoreInitializer({ store }: { store: StoreData }) {
  const setStore = useStoreData((state) => state.setStore);

  useEffect(() => {
    setStore(store);
  }, [store, setStore]);

  return null;
}