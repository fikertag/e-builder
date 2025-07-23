"use client";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

interface IAiFormData {
  owner: string;
  storeName: string;
  subdomain: string;
  heroHeading: string;
  heroDescription: string;
  aboutUs: string;
  whyChooseUs: string[];
  description: string;
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
  theme: string; // ObjectId as string
  // template?: string;
  isPublished?: boolean;
  integrations?: {
    telebirr?: {
      number: string;
      name: string;
    };
    cbe?: {
      account: string;
      name: string;
    };
  };
}



export default function CreatePage() {
  const [shopDescription, setShopDescription] = useState("");
  const [loading, setLoading] = useState(false); // For store creation
  const [aiLoading, setAiLoading] = useState(false); // For AI generation
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<IAiFormData | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const user = useUser();
  // Theme list as provided
  const themeList = [
    { _id: '6871c55b34513073bdfadb67', name: 'amber-minimal' },
    { _id: '6871c66634513073bdfadb6a', name: 'amethyst-haze' },
    { _id: '6871c6cc34513073bdfadb6c', name: 'bold-tech' },
    { _id: '6871c75634513073bdfadb70', name: 'bubblegum' },
    { _id: '6871c79a34513073bdfadb72', name: 'caffeine' },
    { _id: '6871c7e734513073bdfadb76', name: 'candyland' },
    { _id: '6871c83e34513073bdfadb79', name: 'catppuccin' },
    { _id: '6871c87334513073bdfadb7b', name: 'claude' },
    { _id: '6871c8b934513073bdfadb7d', name: 'claymorphism' },
    { _id: '6871c92734513073bdfadb81', name: 'clean-slate' },
    { _id: '6871c99134513073bdfadb83', name: 'cyberpunk' },
    { _id: '6871ca2334513073bdfadb85', name: 'elegant-luxury' },
    { _id: '6871ca6f34513073bdfadb87', name: 'graphite' },
    { _id: '6871cb1134513073bdfadb89', name: 'mocha-mousse' },
    { _id: '6871cb7134513073bdfadb8b', name: 'nature' },
    { _id: '6871cbbc34513073bdfadb8d', name: 'northern-lights' },
    { _id: '6871cbfe34513073bdfadb8f', name: 'notebook' },
    { _id: '6871cc3a34513073bdfadb91', name: 'ocean-breeze' },
    { _id: '6871cca334513073bdfadb93', name: 'pastel-dreams' },
    { _id: '6871cd5a34513073bdfadb95', name: 'starry-night' },
  ];

  // AI Generator handler
  const handleGenerate = async () => {
    setAiLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: shopDescription }),
      });
      const data = await res.json();
      setFormData(data);
    } catch (e) {
      setError("Failed to generate shop. Please try again.");
      console.log("Error generating shop:", e);
    } finally {
      setAiLoading(false);
    }
  };

  // Manual form change handler
  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (!formData) return;
    if (name === "whyChooseUs") {
      setFormData({ ...formData, whyChooseUs: value.split("\n") });
    } else if (name.startsWith("whyChooseUs_")) {
      // Handle individual whyChooseUs fields
      const idx = parseInt(name.split("_")[1], 10);
      const reasons = Array.isArray(formData.whyChooseUs) ? [...formData.whyChooseUs] : [""];
      reasons[idx] = value;
      while (reasons.length < 3) reasons.push("");
      setFormData({ ...formData, whyChooseUs: reasons });
    } else if (name === "theme") {
      setFormData({ ...formData, theme: value });
    } else if (name.startsWith("integrations.telebirr.")) {
      const key = name.split(".")[2];
      const prev = (formData.integrations && formData.integrations.telebirr) as Partial<{number: string; name: string}> || {};
      const telebirr = {
        number: key === "number" ? value : (prev && typeof prev.number === 'string' ? prev.number : ""),
        name: key === "name" ? value : (prev && typeof prev.name === 'string' ? prev.name : ""),
      };
      setFormData({
        ...formData,
        integrations: {
          ...formData.integrations,
          telebirr,
          ...(formData.integrations?.cbe ? { cbe: formData.integrations.cbe } : {}),
        },
      });
    } else if (name.startsWith("integrations.cbe.")) {
      const key = name.split(".")[2];
      const prev = (formData.integrations && formData.integrations.cbe) as Partial<{account: string; name:string}> || {};
      const cbe = {
        account: key === "account" ? value :( prev && typeof prev.account === 'string' ? prev.account : ""),
        name: key === "name" ? value : ( prev && typeof prev.name === 'string' ? prev.name : ""),
      };
      setFormData({
        ...formData,
        integrations: {
          ...formData.integrations,
          cbe,
          ...(formData.integrations?.telebirr ? { telebirr: formData.integrations.telebirr } : {}),
        },
      });
    } else if (name.startsWith("contact.social.")) {
      const key = name.split(".")[2];
      setFormData({
        ...formData,
        contact: {
          ...formData.contact,
          social: {
            ...((formData.contact && formData.contact.social) || {}),
            [key]: value,
          },
        },
      });
    } else if (name.startsWith("contact.")) {
      const key = name.split(".")[1];
      setFormData({
        ...formData,
        contact: {
          ...formData.contact,
          [key]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Submit handler
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
        body: JSON.stringify({
          ...formData,
          owner: user?.user?.id,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to create store");
      } else {
        setSuccess("Store created successfully!");
          router.push("/dashboard");
       
      }
    } catch (err) {
      console.log("Error creating store:", err);
    } finally {
      setLoading(false);
    }
  };

  // Image upload handler
  async function handleImageUpload(file: File) {
    setImageLoading(true);
    setImageError(null);
    const formDataUpload = new FormData();
    formDataUpload.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formDataUpload,
      });
      const { url } = await res.json();
      if (!res.ok) {
        setImageError("Failed to upload image.");
        setImageLoading(false);
        return;
      }
      setImageUrl(url);
      setFormData((prev) =>
        prev ? { ...prev, storeLandingImage: url } : prev
      );
    } catch (err) {
      setImageError("Failed to upload image.");
      console.error("Error uploading image:", err);
    } finally {
      setImageLoading(false);
    }
  }

  // Initial form state for manual entry if user skips AI
  useEffect(() => {
    if (!formData) {
      setFormData({
        owner: "",
        storeName: "",
        subdomain: "",
        heroHeading: "",
        heroDescription: "",
        aboutUs: "",
        whyChooseUs: ["", "", ""],
        description: "",
        contact: {},
        storeLandingImage: "",
        theme: "",
        isPublished: false,
        integrations: {},
      });
    }
  }, [formData]);

  return (
    <div className="w-full min-h-screen pb-12 px-2 md:px-8 flex flex-col gap-10 mx-auto">
      {/* AI Chat/Description Generator Section */}
      <div className="w-full max-w-5xl mx-auto p-3 md:p-5 mb-4 flex flex-col items-center">
        <h2 className="text-xl md:text-2xl font-bold mb-2 text-primary text-center tracking-tight">
          Let AI Generate Your Shop Details (Optional)
        </h2>
        <p className="text-muted-foreground/70 mb-1 mt-3 text-center text-base max-w-2xl">
          Describe your business & products. The AI will fill the form for you automatically.
        </p>
        <div className="relative w-full max-w-3xl">
          <textarea
            className="w-full min-h-[120px] max-h-[300px] p-5 pr-24 border-2 border-primary rounded-xl focus:ring-2 focus:ring-primary focus:outline-none text-base md:text-lg bg-white shadow-sm"
            placeholder="e.g. A modern bakery selling gluten-free pastries with a cozy, rustic vibe"
            value={shopDescription}
            onChange={(e) => setShopDescription(e.target.value)}
            onInput={(e) => {
              const el = e.currentTarget;
              el.style.height = "";
              el.style.height = el.scrollHeight + "px";
            }}
            style={{ overflow: "hidden", resize: "none" }}
          />
          <button
            type="button"
            onClick={handleGenerate}
            disabled={aiLoading || !shopDescription.trim()}
            className="absolute bottom-4 right-4 px-4 py-2 rounded-md bg-primary text-white font-semibold text-xs shadow hover:bg-primary/90 transition disabled:opacity-60"
            style={{ zIndex: 2 }}
          >
            {aiLoading ? "..." : "Generate"}
          </button>
        </div>
        {error && (
          <div className="text-red-500 mt-3 text-center">{error}</div>
        )}
      </div>

      {/* Manual Form Section (always visible) */}
      <div className="w-full flex flex-col lg:flex-row gap-8">
        {/* Image upload section */}
       
        {/* Main form section */}
        <form
          className="w-full grid grid-cols-1 bg-white rounded-2xl shadow-xl p-6 border border-border"
          onSubmit={handleSubmit}
        ><div className="lg:w-[340px] mx-auto w-full p-6 flex flex-col items-center mb-8 self-start">
          <label className="block font-semibold mb-2">
            Landing Page Image <span className="text-red-500">*</span>
          </label>
          <div className="relative w-full max-w-xs h-40 rounded-xl overflow-hidden bg-muted flex items-center justify-center">
            {imageLoading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10">
                <svg
                  className="animate-spin h-8 w-8 text-primary"
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
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                No image selected
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleImageUpload(file);
            }}
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-4 px-6 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 transition"
            disabled={imageLoading}
          >
            {imageLoading ? "Uploading..." : "Choose Image"}
          </button>
          {imageError && <div className="text-red-500 mt-2">{imageError}</div>}
        </div>
          {/* Store Name and Subdomain on one row, others full row */}
          <div className="flex flex-col gap-y-2 w-full md:col-span-2 mb-2">
             
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 mb-1">
              <div className="flex flex-col">
                <label className="block text-xs font-normal mb-0 pt-2">Store Name</label>
                <input name="storeName" value={formData?.storeName || ""} onChange={handleFormChange} className="w-full pb-2 pt-1 border-b border-border bg-transparent text-base focus:outline-none focus:border-primary transition" />
              </div>
              <div className="flex flex-col">
                <label className="block text-xs font-normal mb-0 pt-2">Subdomain</label>
                <input name="subdomain" value={formData?.subdomain || ""} onChange={handleFormChange} className="w-full pb-2 pt-1 border-b border-border bg-transparent text-base focus:outline-none focus:border-primary transition" />
              </div>
            </div>
            <div className="flex flex-col mb-1">
              <label className="block text-xs font-normal mb-0 pt-2">Hero Heading</label>
              <input name="heroHeading" value={formData?.heroHeading || ""} onChange={handleFormChange} className="w-full pb-2 pt-1 border-b border-border bg-transparent text-base focus:outline-none focus:border-primary transition" />
            </div>
            <div className="flex flex-col mb-1">
              <label className="block text-xs font-normal mb-0 pt-2">Hero Description</label>
              <input name="heroDescription" value={formData?.heroDescription || ""} onChange={handleFormChange} className="w-full pb-2 pt-1 border-b border-border bg-transparent text-base focus:outline-none focus:border-primary transition" />
            </div>
            <div className="flex flex-col mb-1">
              <label className="block text-xs font-normal mb-0 pt-2">About Us</label>
              <input name="aboutUs" value={formData?.aboutUs || ""} onChange={handleFormChange} className="w-full pb-2 pt-1 border-b border-border bg-transparent text-base focus:outline-none focus:border-primary transition" />
            </div>
            <div className="flex flex-col mb-1">
              <label className="block text-xs font-normal mb-0 pt-2">Why Choose Us</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-2">
                {[0,1,2].map((idx) => (
                  <input
                    key={idx}
                    name={`whyChooseUs_${idx}`}
                    value={formData?.whyChooseUs?.[idx] || ""}
                    onChange={handleFormChange}
                    className="w-full pb-2 pt-1 border-b border-border bg-transparent text-base focus:outline-none focus:border-primary transition"
                    placeholder={`Reason ${idx+1}`}
                  />
                ))}
              </div>
            </div>
            <div className="flex flex-col mb-1">
              <label className="block text-xs font-normal mb-0 pt-2">Description</label>
              <input name="description" value={formData?.description || ""} onChange={handleFormChange} className="w-full pb-2 pt-1 border-b border-border bg-transparent text-base focus:outline-none focus:border-primary transition" />
            </div>
          </div>
          {/* Remaining fields in two columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8 gap-y-2 w-full md:col-span-2">
            <div className="flex flex-col mb-1">
              <label className="block text-xs font-normal mb-0 pt-2">Theme <span className="text-red-500">*</span></label>
              <select
                name="theme"
                value={formData?.theme || ""}
                onChange={handleFormChange}
                className="w-full pb-2 pt-1 border-b border-border bg-transparent text-base focus:outline-none focus:border-primary transition"
                required
              >
                <option value="">Select a theme</option>
                {themeList.map((theme) => (
                  <option key={theme._id} value={theme._id}>{theme.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col mb-1">
              <label className="block text-xs font-normal mb-0 pt-2">Store Template</label>
              <select
                name="template"
                value="defult"
                disabled
                className="w-full pb-2 pt-1 border-b border-border bg-transparent text-base focus:outline-none focus:border-primary transition opacity-60 cursor-not-allowed"
              >
                <option value="minimalist">Default</option>
              </select>
            </div>
            {/* Integrations: Telebirr */}
            <div className="flex flex-col mb-1">
              <label className="block text-xs font-normal mb-0 pt-2">Telebirr Number</label>
              <input
                name="integrations.telebirr.number"
                value={formData?.integrations?.telebirr?.number || ""}
                onChange={handleFormChange}
                className="w-full pb-2 pt-1 border-b border-border bg-transparent text-base focus:outline-none focus:border-primary transition"
                placeholder="Telebirr Number"
              />
            </div>
            <div className="flex flex-col mb-1">
              <label className="block text-xs font-normal mb-0 pt-2">Telebirr Name</label>
              <input
                name="integrations.telebirr.name"
                value={formData?.integrations?.telebirr?.name || ""}
                onChange={handleFormChange}
                className="w-full pb-2 pt-1 border-b border-border bg-transparent text-base focus:outline-none focus:border-primary transition"
                placeholder="Telebirr Name"
              />
            </div>
            {/* Integrations: CBE */}
            <div className="flex flex-col mb-1">
              <label className="block text-xs font-normal mb-0 pt-2">CBE Account</label>
              <input
                name="integrations.cbe.account"
                value={formData?.integrations?.cbe?.account || ""}
                onChange={handleFormChange}
                className="w-full pb-2 pt-1 border-b border-border bg-transparent text-base focus:outline-none focus:border-primary transition"
                placeholder="CBE Account"
              />
            </div>
            <div className="flex flex-col mb-1">
              <label className="block text-xs font-normal mb-0 pt-2">CBE Name</label>
              <input
                name="integrations.cbe.name"
                value={formData?.integrations?.cbe?.name || ""}
                onChange={handleFormChange}
                className="w-full pb-2 pt-1  border-b border-border bg-transparent text-base focus:outline-none focus:border-primary transition"
                placeholder="CBE Name"
              />
            </div>
            <div className="flex flex-col mb-1">
              <label className="block text-xs font-normal mb-0 pt-2">Contact Email</label>
              <input name="contact.email" value={formData?.contact?.email || ""} onChange={handleFormChange} className="w-full pb-2 pt-1 border-b border-border bg-transparent text-base focus:outline-none focus:border-primary transition" />
            </div>
            <div className="flex flex-col mb-1">
              <label className="block text-xs font-normal mb-0 pt-2">Phone Number</label>
              <input name="contact.phone" value={formData?.contact?.phone || ""} onChange={handleFormChange} className="w-full pb-2 pt-1 border-b border-border bg-transparent text-base focus:outline-none focus:border-primary transition" />
            </div>
            <div className="flex flex-col mb-1">
              <label className="block text-xs font-normal mb-0 pt-2">Contact Address</label>
              <input name="contact.address" value={formData?.contact?.address || ""} onChange={handleFormChange} className="w-full pb-2 pt-1 border-b border-border bg-transparent text-base focus:outline-none focus:border-primary transition" />
            </div>
            <div className="flex flex-col mb-1">
              <label className="block text-xs font-normal mb-0 pt-2">Instagram <span className="text-muted-foreground">(username only, e.g. fikir)</span></label>
              <input name="contact.social.instagram" value={formData?.contact?.social?.instagram || ""} onChange={handleFormChange} className="w-full pb-2 pt-1 border-b border-border bg-transparent text-base focus:outline-none focus:border-primary transition" placeholder="username" />
            </div>
            <div className="flex flex-col mb-1">
              <label className="block text-xs font-normal mb-0 pt-2">Facebook <span className="text-muted-foreground">(username only, e.g. fikir)</span></label>
              <input name="contact.social.facebook" value={formData?.contact?.social?.facebook || ""} onChange={handleFormChange} className="w-full pb-2 pt-1 border-b border-border bg-transparent text-base focus:outline-none focus:border-primary transition" placeholder="username" />
            </div>
            <div className="flex flex-col mb-1">
              <label className="block text-xs font-normal mb-0 pt-2">Twitter <span className="text-muted-foreground">(username only, e.g. fikir)</span></label>
              <input name="contact.social.twitter" value={formData?.contact?.social?.twitter || ""} onChange={handleFormChange} className="w-full pb-2 pt-1 border-b border-border bg-transparent text-base focus:outline-none focus:border-primary transition" placeholder="username" />
            </div>
            <div className="flex flex-col mb-1">
              <label className="block text-xs font-normal mb-0 pt-2">TikTok <span className="text-muted-foreground">(username only, e.g. fikir)</span></label>
              <input name="contact.social.tiktok" value={formData?.contact?.social?.tiktok || ""} onChange={handleFormChange} className="w-full pb-2 pt-1 border-b border-border bg-transparent text-base focus:outline-none focus:border-primary transition" placeholder="username" />
            </div>
            <div className="flex flex-col mb-1">
              <label className="block text-xs font-normal mb-0 pt-2">YouTube <span className="text-muted-foreground">(username only, e.g. fikir)</span></label>
              <input name="contact.social.youtube" value={formData?.contact?.social?.youtube || ""} onChange={handleFormChange} className="w-full pb-2 pt-1 border-b border-border bg-transparent text-base focus:outline-none focus:border-primary transition" placeholder="username" />
            </div>
          </div>
          <div className="md:col-span-2 mt-4">
            <button
              type="submit"
              className="w-full bg-primary text-white font-semibold text-base shadow hover:bg-primary/90 transition disabled:opacity-60 py-3 rounded-lg"
              disabled={loading || !imageUrl}
            >
              {loading ? "Creating Store..." : "Create My Store"}
            </button>
            {error && (
              <div className="text-red-500 mt-4 text-center">{error}</div>
            )}
            {success && (
              <div className="text-green-600 mt-4 text-center">{success}</div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
