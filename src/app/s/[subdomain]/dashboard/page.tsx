"use client";
import { useStoreData } from "@/store/useStoreData";
import {
  ShoppingCart,
  Package,
  Palette,
  Settings,
  BarChart2,
  Store,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const sections = [
  { key: "overview", label: "Overview", icon: BarChart2 },
  { key: "products", label: "Products", icon: Package },
  { key: "orders", label: "Orders", icon: ShoppingCart },
  { key: "settings", label: "Store Settings", icon: Settings },
  { key: "theme", label: "Theme & Appearance", icon: Palette },
  { key: "analytics", label: "Analytics", icon: BarChart2 },
];

export default function DashboardPage() {
  const store = useStoreData((state) => state.store);
  const [active, setActive] = useState("overview");

  return (
    <div className="min-h-screen w-full bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-56 h-full bg-white border-r border-gray-200 shadow-sm py-8 px-4 gap-2">
        <div className="mb-8 text-2xl font-extrabold text-gray-900 flex items-center gap-2">
          <Store className="text-gray-700" size={24} />
          Dashboard
        </div>
        <nav className="flex flex-col gap-1">
          {sections.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg text-base font-medium transition-colors",
                active === key
                  ? "bg-gray-100 text-gray-900 shadow"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
              onClick={() => setActive(key)}
            >
              <Icon className="w-5 h-5" />
              {label}
            </button>
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10">
        {/* Overview Section */}
        {active === "overview" && (
          <section className="bg-white rounded-2xl shadow p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BarChart2 /> Overview
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">Products</div>
                <div className="text-2xl font-bold">{"--"}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">Orders</div>
                <div className="text-2xl font-bold">{"--"}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">Revenue</div>
                <div className="text-2xl font-bold">${"--"}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">Status</div>
                <div className="text-2xl font-bold">{"Active"}</div>
              </div>
            </div>
          </section>
        )}
        {/* Products Section */}
        {active === "products" && (
          <section className="bg-white rounded-2xl shadow p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Package /> Products
            </h2>
            <p className="text-gray-700 mb-2">
              Manage your products, add new items, and update inventory.
            </p>
            {/* Product management UI goes here */}
            <div className="text-gray-400 italic">
              (Product management coming soon...)
            </div>
          </section>
        )}
        {/* Orders Section */}
        {active === "orders" && (
          <section className="bg-white rounded-2xl shadow p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <ShoppingCart /> Orders
            </h2>
            <p className="text-gray-700 mb-2">
              View and manage your store's orders and fulfillment status.
            </p>
            {/* Orders management UI goes here */}
            <div className="text-gray-400 italic">
              (Order management coming soon...)
            </div>
          </section>
        )}
        {/* Store Settings Section */}
        {active === "settings" && (
          <section className="bg-white rounded-2xl shadow p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Settings /> Store Settings
            </h2>
            <p className="text-gray-700 mb-2">
              Edit your store info, contact, and branding.
            </p>
            {/* Store settings UI goes here */}
            <div className="text-gray-400 italic">
              (Store settings coming soon...)
            </div>
          </section>
        )}
        {/* Theme Section */}
        {active === "theme" && (
          <section className="bg-white rounded-2xl shadow p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Palette /> Theme & Appearance
            </h2>
            <p className="text-gray-700 mb-2">
              Customize your store's look and feel.
            </p>
            {/* Theme customization UI goes here */}
            <div className="text-gray-400 italic">
              (Theme customization coming soon...)
            </div>
          </section>
        )}
        {/* Analytics Section */}
        {active === "analytics" && (
          <section className="bg-white rounded-2xl shadow p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <BarChart2 /> Analytics
            </h2>
            <p className="text-gray-700 mb-2">
              Track your sales, orders, and visitors.
            </p>
            {/* Analytics UI goes here */}
            <div className="text-gray-400 italic">
              (Analytics coming soon...)
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
