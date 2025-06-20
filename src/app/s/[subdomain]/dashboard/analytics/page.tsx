"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BarChart2 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <Card className="w-full">
      <CardHeader className="flex items-center gap-2">
        <BarChart2 className="text-gray-500" />
        <CardTitle>Analytics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-gray-500 text-center py-8">Analytics and reports will be shown here.</div>
      </CardContent>
    </Card>
  );
}
