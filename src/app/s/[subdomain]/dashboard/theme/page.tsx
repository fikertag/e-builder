"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Palette } from "lucide-react";

export default function ThemePage() {
  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader className="flex items-center gap-2">
        <Palette className="text-gray-500" />
        <CardTitle>Theme Customization</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-gray-500 text-center py-8">Theme customization options will be available here soon.</div>
      </CardContent>
    </Card>
  );
}
