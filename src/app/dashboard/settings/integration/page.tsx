"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AudioWaveform } from "lucide-react";
import { useStoreData } from "@/store/useStoreData";
import { useMutation } from "@tanstack/react-query";

export default function IntegrationsPage() {
  const stores = useStoreData((state) => state.stores);
  const selectedStoreId = useStoreData((state) => state.selectedStoreId);
  const store = stores.find((s) => s.id === selectedStoreId);
  const updateStore = useStoreData((state) => state.updateStore);
  const [form, setForm] = useState({
    telebirr: store?.integrations?.telebirr?.number || "",
    telebirrName: store?.integrations?.telebirr?.name || "",
    cbeAccount: store?.integrations?.cbe?.account || "",
    cbeName: store?.integrations?.cbe?.name || "",
  });
  const [status, setStatus] = useState<null | "success" | "error">(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm({
      telebirr: store?.integrations?.telebirr?.number || "",
      telebirrName: store?.integrations?.telebirr?.name || "",
      cbeAccount: store?.integrations?.cbe?.account || "",
      cbeName: store?.integrations?.cbe?.name || "",
    });
  }, [store]);

  const mutation = useMutation({
    mutationFn: async (data: typeof form) => {
      setLoading(true);
      setStatus(null);
      const res = await fetch("/api/store", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          integrations: {
            telebirr: { number: data.telebirr, name: data.telebirrName },
            cbe: { account: data.cbeAccount, name: data.cbeName },
          },
          subdomain: store?.subdomain,
        }),
      });
      setLoading(false);
      if (!res.ok) throw new Error("Failed to update integrations");
      return res.json();
    },
    onSuccess: (updatedStore) => {
      updateStore(updatedStore);
      setStatus("success");
    },
    onError: () => setStatus("error"),
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    if (!/^\+2519\d{8}$/.test(form.telebirr)) {
      setError("Telebirr number must be in the format +2519XXXXXXXX.");
      return false;
    }
    if (!form.telebirrName.trim()) {
      setError("Telebirr account name is required.");
      return false;
    }
    if (!/^1000\d{8,}$/.test(form.cbeAccount)) {
      setError("CBE account must start with 1000 and be at least 12 digits.");
      return false;
    }
    if (!form.cbeName.trim()) {
      setError("CBE account name is required.");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);
    if (!validate()) return;
    mutation.mutate(form);
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader className="flex items-center gap-2">
        <AudioWaveform className="text-gray-500" />
        <CardTitle>Integrations</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4 max-w-md mx-auto" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telebirr Number
            </label>
            <input
              type="text"
              name="telebirr"
              value={form.telebirr}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="+2519XXXXXXXX"
              maxLength={13}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telebirr Account Name
            </label>
            <input
              type="text"
              name="telebirrName"
              value={form.telebirrName}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="Telebirr account holder name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CBE Account Number
            </label>
            <input
              type="text"
              name="cbeAccount"
              value={form.cbeAccount}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="1000XXXXXXXX"
              maxLength={20}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              CBE Account Name
            </label>
            <input
              type="text"
              name="cbeName"
              value={form.cbeName}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="CBE account holder name"
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <button
            type="submit"
            className="px-4 py-2 rounded bg-gray-900 text-white font-semibold hover:bg-gray-700 transition"
            disabled={loading || mutation.isPending}
          >
            {loading || mutation.isPending ? "Saving..." : "Save Changes"}
          </button>
          {status === "success" && (
            <div className="text-green-600 mt-2">Integrations saved!</div>
          )}
          {status === "error" && (
            <div className="text-red-600 mt-2">
              Failed to save. Please try again.
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
