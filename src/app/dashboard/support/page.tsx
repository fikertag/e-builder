"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { HelpCircle } from "lucide-react";

export default function SupportPage() {
  return (
    <Card className="max-w-xl mx-auto mt-8">
      <CardHeader className="flex items-center gap-2">
        <HelpCircle className="text-blue-500" />
        <CardTitle>Support & Help</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>If you need assistance, please reach out to our support team:</p>
          <ul className="list-disc pl-6">
            <li>
              Email:{" "}
              <a href="mailto:fikeryilkaltages@gmail.com" className="underline">
                fikeryilkaltages@gmail.com
              </a>
            </li>
            <li>
              Phone:{" "}
              <a href="tel:+251911717142" className="underline">
                +251 911 717 142
              </a>
            </li>
          </ul>
          <p className="text-sm text-gray-500">
            We typically respond within 1 business day.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
