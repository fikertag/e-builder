"use client";
import { useState, useRef } from "react";
import Image from "next/image";

interface IAiFormData {
  owner: string;
  storeName: string;
  subdomain: string;
  heroHeading: string;
  heroDescription: string;
  aboutUs: string;
  whyChooseUs: string[];
  description: string;
  aiConfig: {
    colorPalette: { primary: string; secondary: string; accent: string };
    typography: { heading: string; body: string };
    layoutTemplate: string;
  };
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
    social?: {
      instagram?: string;
      facebook?: string;
      twitter?: string;
      tiktok?: string;
      youtube?: string;
    };
  };
  storeLandingImage: string;
}

export default function HomePage() {
  const [shopDescription, setShopDescription] = useState("");
  const [aiResult, setAiResult] = useState<IAiFormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<IAiFormData | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setAiResult(null);
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: shopDescription }),
      });
      const data = await res.json();
      setAiResult(data);
      setFormData(data);
    } catch (e) {
      setError("Failed to generate shop. Please try again.");
      console.log("Error generating shop:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (!formData) return;
    if (name === "whyChooseUs") {
      setFormData({ ...formData, whyChooseUs: value.split("\n") });
    } else if (name.startsWith("aiConfig.")) {
      const [, section, key] = name.split(".");
      setFormData({
        ...formData,
        aiConfig: {
          ...formData.aiConfig,
          [section]: {
            ...formData.aiConfig[section as "colorPalette" | "typography"],
            [key]: value,
          },
        },
      });
    } else if (name.startsWith("contact.")) {
      const [, key] = name.split(".");
      setFormData({
        ...formData,
        contact: {
          ...formData.contact,
          [key]: value,
        },
      });
    } else if (name.startsWith("contact.social.")) {
      const parts = name.split(".");
      const key = parts[2];
      setFormData({
        ...formData,
        contact: {
          ...formData.contact,
          social: {
            ...formData.contact?.social,
            [key]: value,
          },
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    if (!formData) return;
    try {
      const res = await fetch("/api/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, owner: "6824dab1b90b388b8d6e58e2" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to create store");
      } else {
        setSuccess("Store created successfully!");
        // Optionally: redirect or reset form
      }
    } catch (err) {
      console.log("Error creating store:", err);
    } finally {
      setLoading(false);
    }
  };

  async function handleImageUpload(file: File) {
    setImageLoading(true);
    setImageError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const { url } = await res.json();

      if (!res.ok) {
        setImageError('Failed to upload image.');
        setImageLoading(false);
        return;
      }

      setImageUrl(url); 
      setFormData((prev) => prev ? { ...prev, storeLandingImage: url } : prev);
    } catch (err) {
      setImageError('Failed to upload image.');
      console.error('Error uploading image:', err);
    } finally {
      setImageLoading(false);
    }
  }

  if (!aiResult || !formData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 h-[100dvh] flex justify-center items-center">
        <div className="bg-gradient-to-br from-indigo-50 to-white rounded-xl shadow-lg p-4 md:p-8 mb-8 border border-indigo-100">
          <h1 className="text-2xl md:text-3xl font-bold mb-2 text-indigo-700 text-center">
            Describe Your Shop and Let AI Build It!
          </h1>
          <p className="text-gray-500 mb-6 text-center">
            Describe your business & products in detail. The AI will
            generate your shop&apos;s branding and content. 
          </p>
          <textarea
            className="w-full min-h-[100px] p-3 border border-indigo-200 rounded-md focus:ring-2 focus:ring-indigo-400 focus:outline-none text-base mb-4 resize-none"
            placeholder="e.g. A modern bakery selling gluten-free pastries with a cozy, rustic vibe"
            value={shopDescription}
            onChange={(e) => setShopDescription(e.target.value)}
            onInput={e => {
                const el = e.currentTarget;
                el.style.height = "";
                el.style.height = el.scrollHeight + "px";
              }}
              style={{ overflow: "hidden", resize: "none" }}
          />
          <button
            onClick={handleGenerate}
            disabled={loading || !shopDescription.trim()}
            className="w-full py-3 rounded-md bg-indigo-600 text-white font-semibold text-lg shadow hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? "Generating..." : "Generate My Shop"}
          </button>
          {error && (
            <div className="text-red-500 mt-3 text-center">{error}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-indigo-50 to-white py-12 px-2 md:px-8 flex flex-col">
      <h2 className="text-3xl font-bold text-indigo-700 mb-8 text-center">
        Edit Your AI-Generated Shop Description
      </h2>
      <div className="w-full flex flex-col md:flex-row gap-8">
        {/* Image upload section */}
        <div className="md:w-[340px] w-full bg-white rounded-2xl shadow-xl p-6 border border-indigo-100 flex flex-col items-center mb-8 md:mb-0 self-start">
          <label className="block font-semibold mb-2">
            Landing Page Image <span className="text-red-500">*</span>
          </label>
          <div className="relative w-full max-w-xs h-40 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center">
            {imageLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                <svg
                  className="animate-spin h-8 w-8 text-indigo-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              </div>
            ) : null}
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt="Landing Preview"
                fill
                style={{ objectFit: "contain", filter: "blur(0.5px)" }}
                className={`transition-opacity duration-700 ${imageLoading ? "opacity-0" : "opacity-100"}`}
                sizes="(max-width: 600px) 100vw, 340px"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                No image selected
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 px-6 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition"
            disabled={imageLoading}
          >
            {imageLoading ? "Uploading..." : "Choose Image"}
          </button>
          {imageError && <div className="text-red-500 mt-2">{imageError}</div>}
        </div>
        {/* Main form section */}
        <form
          className="md:w-2/3 w-full grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 bg-white rounded-2xl shadow-xl p-6 border border-indigo-100"
          onSubmit={handleSubmit}
        >
          {/* Key fields on their own rows */}
          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">Store Name</label>
            <input
              name="storeName"
              value={formData.storeName || ""}
              onChange={handleFormChange}
              className="w-full p-4 border rounded-xl text-lg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">Subdomain</label>
            <input
              name="subdomain"
              value={formData.subdomain || ""}
              onChange={handleFormChange}
              className="w-full p-4 border rounded-xl text-lg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">Hero Heading</label>
            <input
              name="heroHeading"
              value={formData.heroHeading || ""}
              onChange={handleFormChange}
              className="w-full p-4 border rounded-xl text-lg"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">Hero Description</label>
            <textarea
              name="heroDescription"
              value={formData.heroDescription || ""}
              onChange={handleFormChange}
              className="w-full p-2 md:p-4 border rounded-xl text-lg min-h-[120px]"
              onInput={e => {
                const el = e.currentTarget;
                el.style.height = "";
                el.style.height = el.scrollHeight + "px";
              }}
              style={{ overflow: "hidden", resize: "none" }}
              placeholder="Type here..."
            />
          </div>
          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">About Us</label>
            <textarea
              name="aboutUs"
              value={formData.aboutUs || ""}
              onChange={handleFormChange}
              onInput={e => {
                const el = e.currentTarget;
                el.style.height = "";
                el.style.height = el.scrollHeight + "px";
              }}
              style={{ overflow: "hidden", resize: "none" }}
              placeholder="Type here..."
              className="w-full p-2 md:p-4 border rounded-xl text-lg min-h-[120px] "
            />
          </div>
        
          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">Why Choose Us</label>
            <textarea
              name="whyChooseUs"
              value={
                Array.isArray(formData.whyChooseUs)
                  ? formData.whyChooseUs.join("\n")
                  : formData.whyChooseUs || ""
              }
              onChange={handleFormChange}
              className="w-full p-4 border rounded-xl text-lg min-h-[120px]"
              onInput={e => {
                const el = e.currentTarget;
                el.style.height = "";
                el.style.height = el.scrollHeight + "px";
              }}
              style={{ overflow: "hidden", resize: "none" }}
              placeholder="One reason per line"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleFormChange}
              className="w-full p-4 border rounded-xl text-lg min-h-[120px]"
              onInput={e => {
                const el = e.currentTarget;
                el.style.height = "";
                el.style.height = el.scrollHeight + "px";
              }}
              style={{ overflow: "hidden", resize: "none" }}
              placeholder="Type here..."
            />
          </div>
          {/* Branding fields */}
          <div className="md:col-span-2">
            <label className="block font-semibold mb-1">Brand Colors</label>
            <div className="flex flex-row gap-6 bg-gray-50 border border-gray-200 rounded-xl p-4 shadow-sm items-center justify-start">
              {/* Primary */}
              <div className="flex flex-col items-center mx-2">
                <span className="text-xs mb-1 text-gray-500">Primary</span>
               
                <input
                  name="aiConfig.colorPalette.primary"
                  value={formData.aiConfig?.colorPalette?.primary || ""}
                  onChange={handleFormChange}
                  className="w-10 h-10 p-0  bg-transparent cursor-pointer rounded "
                  type="color"
                  aria-label="Primary color"
                />
                <span className="text-[10px] text-gray-400 mt-1">{formData.aiConfig?.colorPalette?.primary}</span>
              </div>
              {/* Secondary */}
              <div className="flex flex-col items-center mx-2">
                <span className="text-xs mb-1 text-gray-500">Secondary</span>
                <input
                  name="aiConfig.colorPalette.secondary"
                  value={formData.aiConfig?.colorPalette?.secondary || ""}
                  onChange={handleFormChange}
                  className="w-10 h-10 p-0 border-none bg-transparent cursor-pointer rounded"
                  type="color"
                  aria-label="Secondary color"
                />
                <span className="text-[10px] text-gray-400 mt-1">{formData.aiConfig?.colorPalette?.secondary}</span>
              </div>
              {/* Accent */}
              <div className="flex flex-col items-center mx-2">
                <span className="text-xs mb-1 text-gray-500">Accent</span>
                <input
                  name="aiConfig.colorPalette.accent"
                  value={formData.aiConfig?.colorPalette?.accent || ""}
                  onChange={handleFormChange}
                  className="w-10 h-10 p-0 border-none bg-transparent cursor-pointer rounded"
                  type="color"
                  aria-label="Accent color"
                />
                <span className="text-[10px] text-gray-400 mt-1">{formData.aiConfig?.colorPalette?.accent}</span>
              </div>
            </div>
          </div>
          <div>
            <label className="block font-semibold mb-1">Heading Font</label>
            <input
              name="aiConfig.typography.heading"
              value={formData.aiConfig?.typography?.heading || ""}
              onChange={handleFormChange}
              className="w-full p-4 border rounded-xl text-lg"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Body Font</label>
            <input
              name="aiConfig.typography.body"
              value={formData.aiConfig?.typography?.body || ""}
              onChange={handleFormChange}
              className="w-full p-4 border rounded-xl text-lg"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Layout Template</label>
            <select
              name="aiConfig.layoutTemplate"
              value={formData.aiConfig?.layoutTemplate || ""}
              onChange={handleFormChange}
              className="w-full p-4 border rounded-xl text-lg"
            >
              <option value="minimalist">Minimalist</option>
              <option value="professional">Professional</option>
              <option value="vibrant">Vibrant</option>
            </select>
          </div>
          {/* Contact fields (optional) */}
          <div>
            <label className="block font-semibold mb-1">Contact Email</label>
            <input
              name="contact.email"
              value={formData.contact?.email || ""}
              onChange={handleFormChange}
              className="w-full p-4 border rounded-xl text-lg"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Contact Phone</label>
            <input
              name="contact.phone"
              value={formData.contact?.phone || ""}
              onChange={handleFormChange}
              className="w-full p-4 border rounded-xl text-lg"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Contact Address</label>
            <input
              name="contact.address"
              value={formData.contact?.address || ""}
              onChange={handleFormChange}
              className="w-full p-4 border rounded-xl text-lg"
            />
          </div>
          {/* Social links (optional) */}
          <div>
            <label className="block font-semibold mb-1">Instagram</label>
            <input
              name="contact.social.instagram"
              value={formData.contact?.social?.instagram || ""}
              onChange={handleFormChange}
              className="w-full p-4 border rounded-xl text-lg"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Facebook</label>
            <input
              name="contact.social.facebook"
              value={formData.contact?.social?.facebook || ""}
              onChange={handleFormChange}
              className="w-full p-4 border rounded-xl text-lg"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Twitter</label>
            <input
              name="contact.social.twitter"
              value={formData.contact?.social?.twitter || ""}
              onChange={handleFormChange}
              className="w-full p-4 border rounded-xl text-lg"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">TikTok</label>
            <input
              name="contact.social.tiktok"
              value={formData.contact?.social?.tiktok || ""}
              onChange={handleFormChange}
              className="w-full p-4 border rounded-xl text-lg"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">YouTube</label>
            <input
              name="contact.social.youtube"
              value={formData.contact?.social?.youtube || ""}
              onChange={handleFormChange}
              className="w-full p-4 border rounded-xl text-lg"
            />
          </div>
          <div className="md:col-span-2">
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-green-600 text-white font-semibold text-sm shadow hover:bg-green-700 transition "
              disabled={loading || !imageUrl}
            >
              {loading ? "Creating Store..." : "Create My Store"}
            </button>
            {error && <div className="text-red-500 mt-4 text-center">{error}</div>}
            {success && <div className="text-green-600 mt-4 text-center">{success}</div>}
          </div>
        </form>
      </div>
    </div>
  );
}