"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";

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

type SocialLinks = {
  instagram: string;
  facebook: string;
  twitter: string;
  tiktok: string;
  youtube: string;
};

type Contact = {
  email?: string;
  phone?: string;
  address?: string;
  social?: Partial<SocialLinks>;
};

export default function CreateStore() {
  const { data: session } = authClient.useSession();
  const [shopDescription, setShopDescription] = useState('');
  const [storeName, setStoreName] = useState("");
  const [subdomain, setSubdomain] = useState("");
  const owner = session?.user?.id;
  const [description, setDescription] = useState("");
  const [primary, setPrimary] = useState("#2563eb");
  const [secondary, setSecondary] = useState("#1e40af");
  const [accent, setAccent] = useState("#f97316");
  const [heading, setHeading] = useState(allowedHeadings[0]);
  const [body, setBody] = useState(allowedBodies[0]);
  const [layoutTemplate, setLayoutTemplate] = useState(allowedTemplates[0]);
  const [heroHeading, setHeroHeading] = useState("");
  const [heroDescription, setHeroDescription] = useState("");
  const [aboutUs, setAboutUs] = useState("");
  const [whyChooseUs, setWhyChooseUs] = useState<string[]>([""]);
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactAddress, setContactAddress] = useState("");
  const [social, setSocial] = useState<SocialLinks>({
    instagram: "",
    facebook: "",
    twitter: "",
    tiktok: "",
    youtube: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function handleWhyChooseUsChange(idx: number, value: string) {
    setWhyChooseUs((prev) => {
      const arr = [...prev];
      arr[idx] = value;
      return arr;
    });
  }
  function addWhyChooseUs() {
    setWhyChooseUs((prev) => [...prev, ""]);
  }
  function removeWhyChooseUs(idx: number) {
    setWhyChooseUs((prev) =>
      prev.length > 1 ? prev.filter((_, i) => i !== idx) : prev
    );
  }
  function handleSocialChange(key: keyof typeof social, value: string) {
    setSocial((prev) => ({ ...prev, [key]: value }));
  }

  async function handleAiSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: shopDescription }),
    });
     const data: string = await res.json();
     setShopDescription(data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    const contact: Contact = {};
    if (contactEmail) contact.email = contactEmail;
    if (contactPhone) contact.phone = contactPhone;
    if (contactAddress) contact.address = contactAddress;
    const hasSocial = Object.values(social).some(Boolean);
    if (hasSocial) contact.social = { ...social };
    const contactToSend = Object.keys(contact).length > 0 ? contact : undefined;

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
          heroHeading,
          heroDescription,
          aboutUs,
          whyChooseUs: whyChooseUs.filter((item) => item.trim()),
          contact: contactToSend,
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
        setHeroHeading("");
        setHeroDescription("");
        setAboutUs("");
        setWhyChooseUs([""]);
        setContactEmail("");
        setContactPhone("");
        setContactAddress("");
        setSocial({
          instagram: "",
          facebook: "",
          twitter: "",
          tiktok: "",
          youtube: "",
        });
      }
    } catch (err) {
      setError("Something went wrong.");
      console.log("Error creating store:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 flex-col">
    <form>
  <label htmlFor="shop-description" className="block font-semibold mb-2">
    Describe Your Shop (AI Powered)
  </label>
  <textarea
    id="shop-description"
    value={shopDescription}
    onChange={e => setShopDescription(e.target.value)}
    placeholder="e.g. A cozy coffee shop selling artisan mugs and beans"
    className="p-3 border rounded-md"
  />
  <button type="submit" onClick={handleAiSubmit}>
   submit
  </button>
    </form>
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
            onChange={(e) => setStoreName(e.target.value)}
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
            onChange={(e) => setSubdomain(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="e.g. myshop"
            maxLength={30}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
            minLength={10}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Hero Heading</label>
          <input
            type="text"
            value={heroHeading}
            onChange={(e) => setHeroHeading(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
            maxLength={100}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Hero Description</label>
          <textarea
            value={heroDescription}
            onChange={(e) => setHeroDescription(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
            maxLength={300}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">About Us</label>
          <textarea
            value={aboutUs}
            onChange={(e) => setAboutUs(e.target.value)}
            className="w-full border rounded px-3 py-2"
            required
            maxLength={1000}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Why Choose Us</label>
          {whyChooseUs.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 mb-2">
              <input
                type="text"
                value={item}
                onChange={(e) => handleWhyChooseUsChange(idx, e.target.value)}
                className="flex-1 border rounded px-3 py-2"
                required
                maxLength={100}
                placeholder={`Reason #${idx + 1}`}
              />
              {whyChooseUs.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeWhyChooseUs(idx)}
                  className="text-red-500 hover:underline"
                  aria-label="Remove reason"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addWhyChooseUs}
            className="text-blue-600 hover:underline text-sm"
          >
            + Add another reason
          </button>
        </div>

        <fieldset className="border rounded p-4">
          <legend className="font-semibold">AI Config</legend>
          <div className="flex gap-4 mb-2">
            <div>
              <label className="block text-sm">Primary Color</label>
              <input
                type="color"
                value={primary}
                onChange={(e) => setPrimary(e.target.value)}
                className="w-12 h-8 p-0 border-none"
              />
            </div>
            <div>
              <label className="block text-sm">Secondary Color</label>
              <input
                type="color"
                value={secondary}
                onChange={(e) => setSecondary(e.target.value)}
                className="w-12 h-8 p-0 border-none"
              />
            </div>
            <div>
              <label className="block text-sm">Accent Color</label>
              <input
                type="color"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                className="w-12 h-8 p-0 border-none"
              />
            </div>
          </div>
          <div className="flex gap-4 mb-2">
            <div>
              <label className="block text-sm">Heading Font</label>
              <select
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                className="border rounded px-2 py-1"
              >
                {allowedHeadings.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm">Body Font</label>
              <select
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="border rounded px-2 py-1"
              >
                {allowedBodies.map((font) => (
                  <option key={font} value={font}>
                    {font}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm">Layout Template</label>
              <select
                value={layoutTemplate}
                onChange={(e) => setLayoutTemplate(e.target.value)}
                className="border rounded px-2 py-1"
              >
                {allowedTemplates.map((tpl) => (
                  <option key={tpl} value={tpl}>
                    {tpl}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </fieldset>

        <fieldset className="border rounded p-4">
          <legend className="font-semibold">Contact (optional)</legend>
          <div className="mb-2">
            <label className="block text-sm">Email</label>
            <input
              type="email"
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="info@myshop.com"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm">Phone</label>
            <input
              type="tel"
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="+123456789"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm">Address</label>
            <input
              type="text"
              value={contactAddress}
              onChange={(e) => setContactAddress(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="123 Main St, City, Country"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm">Social Links</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                value={social.instagram}
                onChange={(e) => handleSocialChange("instagram", e.target.value)}
                className="border rounded px-2 py-1"
                placeholder="Instagram"
              />
              <input
                type="text"
                value={social.facebook}
                onChange={(e) => handleSocialChange("facebook", e.target.value)}
                className="border rounded px-2 py-1"
                placeholder="Facebook"
              />
              <input
                type="text"
                value={social.twitter}
                onChange={(e) => handleSocialChange("twitter", e.target.value)}
                className="border rounded px-2 py-1"
                placeholder="Twitter"
              />
              <input
                type="text"
                value={social.tiktok}
                onChange={(e) => handleSocialChange("tiktok", e.target.value)}
                className="border rounded px-2 py-1"
                placeholder="TikTok"
              />
              <input
                type="text"
                value={social.youtube}
                onChange={(e) => handleSocialChange("youtube", e.target.value)}
                className="border rounded px-2 py-1"
                placeholder="YouTube"
              />
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