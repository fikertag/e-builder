"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function DocsPage() {
  return (
    <Card className="max-w-2xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Documentation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p>
            Welcome to the documentation! Here you can find guides, FAQs, and
            tips for using your e-commerce dashboard.
          </p>
          <ul className="list-disc pl-6 text-gray-700">
            <li>How to add and manage products</li>
            <li>Customizing your store’s theme</li>
            <li>Integrating payment methods</li>
            <li>Managing orders and customers</li>
            <li>Contacting support</li>
          </ul>
          <p className="text-sm text-gray-500">
            For more help, visit our{" "}
            <a href="#" className="underline">
              full documentation site
            </a>{" "}
            or contact support.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
