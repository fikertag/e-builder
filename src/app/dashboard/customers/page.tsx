
"use client";
import { useEffect, useState } from "react";
import { useStoreData } from "@/store/useStoreData";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  realEmail?:string;
  createdAt?: string;
}

export default function CustomersPage() {
  const stores = useStoreData((state) => state.stores);
  const selectedStoreId = useStoreData((state) => state.selectedStoreId);
  const store = stores.find((s) => s.id === selectedStoreId);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    async function fetchCustomers() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/customers/${store?.id}`);
        if (!res.ok) throw new Error("Failed to fetch customers");
        const data = await res.json();
        setCustomers(data ? (Array.isArray(data) ? data : [data]) : []);
      } catch (e) {
        setError("Failed to load customers.");
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, [store?.id]);

  return (
    <div className="w-full max-w-5xl mx-auto py-8 px-2 md:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow border border-border">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-3 px-4 border-b text-left font-semibold text-sm text-gray-700">Name</th>
              <th className="py-3 px-4 border-b text-left font-semibold text-sm text-gray-700">Email</th>
              <th className="py-3 px-4 border-b text-left font-semibold text-sm text-gray-700">Phone</th>
              <th className="py-3 px-4 border-b text-left font-semibold text-sm text-gray-700">Joined</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400">Loading...</td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-red-500">{error}</td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400">No customers found.</td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-50 transition">
                  <td className="py-2 px-4 border-b">{customer.name}</td>
                  <td className="py-2 px-4 border-b">{customer.realEmail}</td>
                  <td className="py-2 px-4 border-b">{customer.phone || "-"}</td>
                  <td className="py-2 px-4 border-b">{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
