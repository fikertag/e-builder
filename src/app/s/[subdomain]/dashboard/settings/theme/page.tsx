"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Palette } from "lucide-react";
import { useStoreData } from "@/store/useStoreData";
import { useMutation } from "@tanstack/react-query";

const headingFonts = [
  "Inter, sans-serif",
  "Playfair Display, serif",
  "Montserrat, sans-serif",
];
const bodyFonts = [
  "Roboto, sans-serif",
  "Open Sans, sans-serif",
  "Lora, serif",
];
const layoutTemplates = ["minimalist", "professional", "vibrant"];

export default function ThemePage() {
  const store = useStoreData((state) => state.store);
  const setStore = useStoreData((state) => state.setStore);
  const [form, setForm] = useState({
    colorPalette: {
      primary: store?.aiConfig?.colorPalette?.primary || "#2563eb",
      secondary: store?.aiConfig?.colorPalette?.secondary || "#1e40af",
      accent: store?.aiConfig?.colorPalette?.accent || "#f97316",
    },
    typography: {
      heading: store?.aiConfig?.typography?.heading || headingFonts[0],
      body: store?.aiConfig?.typography?.body || bodyFonts[0],
    },
    layoutTemplate: store?.aiConfig?.layoutTemplate || "professional",
  });
  const [status, setStatus] = useState<null | "success" | "error">(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (store?.aiConfig) {
      setForm({
        colorPalette: {
          primary: store.aiConfig.colorPalette.primary || "#2563eb",
          secondary: store.aiConfig.colorPalette.secondary || "#1e40af",
          accent: store.aiConfig.colorPalette.accent || "#f97316",
        },
        typography: {
          heading: store.aiConfig.typography.heading || headingFonts[0],
          body: store.aiConfig.typography.body || bodyFonts[0],
        },
        layoutTemplate: store.aiConfig.layoutTemplate || "professional",
      });
    }
  }, [store?.aiConfig]);

  const mutation = useMutation({
    mutationFn: async (data: typeof form) => {
      setLoading(true);
      setStatus(null);
      const res = await fetch("/api/store", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aiConfig: data, subdomain: store?.subdomain }),
      });
      setLoading(false);
      if (!res.ok) throw new Error("Failed to update theme");
      return res.json();
    },
    onSuccess: (updatedStore) => {
      setStore(updatedStore);
      setStatus("success");
    },
    onError: () => setStatus("error"),
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (name.startsWith("colorPalette.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        colorPalette: { ...prev.colorPalette, [key]: value },
      }));
    } else if (name.startsWith("typography.")) {
      const key = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        typography: { ...prev.typography, [key]: value },
      }));
    } else if (name === "layoutTemplate") {
      setForm((prev) => ({
        ...prev,
        layoutTemplate: value as "minimalist" | "professional" | "vibrant",
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader className="flex items-center gap-2">
        <Palette className="text-gray-500" />
        <CardTitle>Theme Customization</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Color Palette */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Color Palette
            </label>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <span className="text-xs mb-1">Primary</span>
                <input
                  type="color"
                  name="colorPalette.primary"
                  value={form.colorPalette.primary}
                  onChange={handleChange}
                  className="w-10 h-10 border-2 border-gray-300 rounded"
                />
                <span className="text-xs mt-1">
                  {form.colorPalette.primary}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs mb-1">Secondary</span>
                <input
                  type="color"
                  name="colorPalette.secondary"
                  value={form.colorPalette.secondary}
                  onChange={handleChange}
                  className="w-10 h-10 border-2 border-gray-300 rounded"
                />
                <span className="text-xs mt-1">
                  {form.colorPalette.secondary}
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-xs mb-1">Accent</span>
                <input
                  type="color"
                  name="colorPalette.accent"
                  value={form.colorPalette.accent}
                  onChange={handleChange}
                  className="w-10 h-10 border-2 border-gray-300 rounded"
                />
                <span className="text-xs mt-1">{form.colorPalette.accent}</span>
              </div>
            </div>
          </div>
          {/* Typography */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Typography
            </label>
            <div className="flex gap-4">
              <div className="flex flex-col">
                <span className="text-xs mb-1">Heading Font</span>
                <select
                  name="typography.heading"
                  value={form.typography.heading}
                  onChange={handleChange}
                  className="border rounded px-2 py-1"
                >
                  {headingFonts.map((font) => (
                    <option
                      key={font}
                      value={font}
                      style={{ fontFamily: font }}
                    >
                      {font}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col">
                <span className="text-xs mb-1">Body Font</span>
                <select
                  name="typography.body"
                  value={form.typography.body}
                  onChange={handleChange}
                  className="border rounded px-2 py-1"
                >
                  {bodyFonts.map((font) => (
                    <option
                      key={font}
                      value={font}
                      style={{ fontFamily: font }}
                    >
                      {font}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
          {/* Layout Template */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Layout Template
            </label>
            <select
              name="layoutTemplate"
              value={form.layoutTemplate}
              onChange={handleChange}
              className="border rounded px-2 py-1"
            >
              {layoutTemplates.map((tpl) => (
                <option key={tpl} value={tpl}>
                  {tpl.charAt(0).toUpperCase() + tpl.slice(1)}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-gray-900 text-white font-semibold hover:bg-gray-700 transition"
            disabled={loading || mutation.isPending}
          >
            {loading || mutation.isPending ? "Saving..." : "Save Changes"}
          </button>
          {status === "success" && (
            <div className="text-green-600 mt-2">
              Theme updated successfully!
            </div>
          )}
          {status === "error" && (
            <div className="text-red-600 mt-2">
              Failed to update theme. Please try again.
            </div>
          )}
        </form>
        {/* Live Preview */}
        <div
          className="mt-8 p-6 rounded border"
          style={{
            background: form.colorPalette.primary,
            color: form.colorPalette.accent,
            fontFamily: form.typography.body,
          }}
        >
          <h2
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: form.typography.heading }}
          >
            Live Theme Preview
          </h2>
          <p>
            This is a preview of your store's theme colors, fonts, and layout
            style.
          </p>
          <div className="mt-2 text-xs">
            Layout: <b>{form.layoutTemplate}</b>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
