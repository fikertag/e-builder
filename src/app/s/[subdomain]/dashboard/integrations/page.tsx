"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { AudioWaveform } from "lucide-react";

export default function IntegrationsPage() {
  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader className="flex items-center gap-2">
        <AudioWaveform className="text-gray-500" />
        <CardTitle>Integrations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-gray-500 text-center py-8">
          Integration options (e.g., Payments, Shipping, Email) will be
          available here soon.
        </div>
      </CardContent>
    </Card>
  );
}
