"use client";
import { useState } from "react";

const allowedHeadings = [
  "Inter, sans-serif",
  "Playfair Display, serif",
  "Montserrat, sans-serif",
];
const allowedBodies = [
  "Roboto, sans-serif",
  "Open Sans, sans-serif",
  "Lora, serif",
];
const allowedTemplates = ["minimalist", "professional", "vibrant"];

export default function CreateStore() {
  const [storeName, setStoreName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const [owner, setOwner] = useState(""); // You may want to get this from auth context
  const [description, setDescription] = useState("");
  const [primary, setPrimary] = useState("#2563eb");
  const [secondary, setSecondary] = useState("#1e40af");
  const [accent, setAccent] = useState("#f97316");
  const [heading, setHeading] = useState(allowedHeadings[0]);
  const [body, setBody] = useState(allowedBodies[0]);
  const [layoutTemplate, setLayoutTemplate] = useState(allowedTemplates[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const aiConfig = {
      colorPalette: { primary, secondary, accent },
      typography: { heading, body },
      layoutTemplate,
    };

    try {
      const res = await fetch("/api/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          storeName,
          subdomain,
          owner,
          description,
          aiConfig,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to create store");
      } else {
        setSuccess("Store created successfully!");
        setStoreName("");
        setSubdomain("");
        setDescription("");
        // Optionally redirect or reset form
      }
    } catch (err) {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-xl space-y-6"
      >
        <h1 className="text-2xl font-bold mb-4">Create a New Store</h1>
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}

        <div>
          <label className="block font-medium mb-1">Store Name</label>
          <input
            type="text"
            value={storeName}
            onChange={e => setStoreName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
            maxLength={100}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Subdomain (optional)</label>
          <input
            type="text"
            value={subdomain}
            onChange={e => setSubdomain(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="e.g. myshop"
            maxLength={30}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Owner User ID</label>
          <input
            type="text"
            value={owner}
            onChange={e => setOwner(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
            placeholder="User ObjectId"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
            minLength={10}
          />
        </div>

        <fieldset className="border rounded p-4">
          <legend className="font-semibold">AI Config</legend>
          <div className="flex gap-4 mb-2">
            <div>
              <label className="block text-sm">Primary Color</label>
              <input
                type="color"
                value={primary}
                onChange={e => setPrimary(e.target.value)}
                className="w-12 h-8 p-0 border-none"
              />
            </div>
            <div>
              <label className="block text-sm">Secondary Color</label>
              <input
                type="color"
                value={secondary}
                onChange={e => setSecondary(e.target.value)}
                className="w-12 h-8 p-0 border-none"
              />
            </div>
            <div>
              <label className="block text-sm">Accent Color</label>
              <input
                type="color"
                value={accent}
                onChange={e => setAccent(e.target.value)}
                className="w-12 h-8 p-0 border-none"
              />
            </div>
          </div>
          <div className="flex gap-4 mb-2">
            <div>
              <label className="block text-sm">Heading Font</label>
              <select
                value={heading}
                onChange={e => setHeading(e.target.value)}
                className="border rounded px-2 py-1"
              >
                {allowedHeadings.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm">Body Font</label>
              <select
                value={body}
                onChange={e => setBody(e.target.value)}
                className="border rounded px-2 py-1"
              >
                {allowedBodies.map(font => (
                  <option key={font} value={font}>{font}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm">Layout Template</label>
              <select
                value={layoutTemplate}
                onChange={e => setLayoutTemplate(e.target.value)}
                className="border rounded px-2 py-1"
              >
                {allowedTemplates.map(tpl => (
                  <option key={tpl} value={tpl}>{tpl}</option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700 transition"
          disabled={loading}
        >
          {loading ? "Creating..." : "Create Store"}
        </button>
      </form>
    </div>
  );
}