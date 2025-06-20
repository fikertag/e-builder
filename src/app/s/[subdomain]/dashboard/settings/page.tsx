"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader className="flex items-center gap-2">
        <Settings className="text-gray-500" />
        <CardTitle>Store Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
            <input type="text" className="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300" placeholder="Enter store name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Store Email</label>
            <input type="email" className="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300" placeholder="Enter store email" />
          </div>
          <button type="submit" className="px-4 py-2 rounded bg-gray-900 text-white font-semibold hover:bg-gray-700 transition">Save Changes</button>
        </form>
      </CardContent>
    </Card>
  );
}
