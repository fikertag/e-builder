"use client";
import { useEffect, useState } from "react";
import { useStoreData } from "@/store/useStoreData";

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  realEmail?: string;
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
        setError(e ? "Failed to load customers." : "Failed to load customers.");
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, [store?.id]);

  return (
    <div className="w-full max-w-5xl mx-auto md:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Customers</h1>
      </div>
      {/* Card layout for mobile and medium screens (below lg) */}
      <div className="block lg:hidden">
        {loading ? (
          <div className="py-8 text-center text-gray-400">Loading...</div>
        ) : error ? (
          <div className="py-8 text-center text-red-500">{error}</div>
        ) : customers.length === 0 ? (
          <div className="py-8 text-center text-gray-400">
            No customers found.
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {customers.map((customer) => (
              <div
                key={customer._id}
                className="rounded-lg border border-border bg-white shadow p-4"
              >
                <div className="flex justify-between items-center mb-2 border-b pb-2">
                  <span className="font-semibold text-lg">{customer.name}</span>
                  {/* You can add a status badge or icon here if needed */}
                </div>
                <div className="text-sm text-gray-600 mb-1 border-b pb-2 flex justify-between">
                  <p className="font-medium">Email:</p> {customer.realEmail}
                </div>
                <div className="text-sm text-gray-600 mb-1 border-b pb-2 flex justify-between">
                  <p className="font-medium">Phone:</p> {customer.phone || "-"}
                </div>
                <div className="text-sm text-gray-600 mb-1 flex justify-between">
                  <p className="font-medium">Joined:</p>{" "}
                  {customer.createdAt
                    ? new Date(customer.createdAt).toLocaleDateString()
                    : "-"}
                </div>
                {/* Add more details or actions here if needed */}
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Table layout for desktop (lg and up) */}
      <div className="hidden lg:block w-full overflow-x-auto rounded-lg shadow border border-border bg-white">
        <table className="min-w-[600px] w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="py-4 px-4 border-b text-left font-semibold text-xs md:text-sm text-gray-700 whitespace-nowrap">
                Name
              </th>
              <th className="py-4 px-4 border-b text-left font-semibold text-xs md:text-sm text-gray-700 whitespace-nowrap">
                Email
              </th>
              <th className="py-4 px-4 border-b text-left font-semibold text-xs md:text-sm text-gray-700 whitespace-nowrap">
                Phone
              </th>
              <th className="py-4 px-4 border-b text-left font-semibold text-xs md:text-sm text-gray-700 whitespace-nowrap">
                Joined
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400">
                  No customers found.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer._id} className="hover:bg-gray-50 transition">
                  <td className="py-2 px-2 md:py-2 md:px-4 border-b whitespace-nowrap">
                    {customer.name}
                  </td>
                  <td className="py-2 px-2 md:py-2 md:px-4 border-b whitespace-nowrap">
                    {customer.realEmail}
                  </td>
                  <td className="py-2 px-2 md:py-2 md:px-4 border-b whitespace-nowrap">
                    {customer.phone || "-"}
                  </td>
                  <td className="py-2 px-2 md:py-2 md:px-4 border-b whitespace-nowrap">
                    {customer.createdAt
                      ? new Date(customer.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
