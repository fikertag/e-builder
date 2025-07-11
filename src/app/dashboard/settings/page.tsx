"use client";

import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Settings } from "lucide-react";
import { useStoreData } from "@/store/useStoreData";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { UploadCloud } from "lucide-react";

export default function SettingsPage() {
  const stores = useStoreData((state) => state.stores);
  const selectedStoreId = useStoreData((state) => state.selectedStoreId);
  const store = stores.find((s) => s.id === selectedStoreId);
  const setStore = useStoreData((state) => state.setStore);
  const [form, setForm] = useState({
    storeName: store?.storeName || "",
    subdomain: store?.subdomain || "",
    storeLandingImage: store?.storeLandingImage || "",
    heroHeading: store?.heroHeading || "",
    heroDescription: store?.heroDescription || "",
    aboutUs: store?.aboutUs || "",
    whyChooseUs: store?.whyChooseUs || [""],
    contact: {
      email: store?.contact?.email || "",
      phone: store?.contact?.phone || "",
      address: store?.contact?.address || "",
      social: {
        instagram: store?.contact?.social?.instagram || "",
        facebook: store?.contact?.social?.facebook || "",
        twitter: store?.contact?.social?.twitter || "",
        tiktok: store?.contact?.social?.tiktok || "",
        youtube: store?.contact?.social?.youtube || "",
      },
    },
    description: store?.description || "",
    isPublished: store?.isPublished ?? false,
  });
  const [isImageUploading, setIsImageUploading] = useState(false);

  const mutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const res = await fetch("/api/store", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, subdomain: data.subdomain }),
      });
      if (!res.ok) throw new Error("Failed to update store");
      return res.json();
    },
    onSuccess: (updatedStore) => {
      setStore(updatedStore);
    },
  });

  useEffect(() => {
    if (store) {
      setForm({
        storeName: store.storeName || "",
        subdomain: store.subdomain || "",
        storeLandingImage: store.storeLandingImage || "",
        heroHeading: store.heroHeading || "",
        heroDescription: store.heroDescription || "",
        aboutUs: store.aboutUs || "",
        whyChooseUs: store.whyChooseUs || [""],
        contact: {
          email: store.contact?.email || "",
          phone: store.contact?.phone || "",
          address: store.contact?.address || "",
          social: {
            instagram: store.contact?.social?.instagram || "",
            facebook: store.contact?.social?.facebook || "",
            twitter: store.contact?.social?.twitter || "",
            tiktok: store.contact?.social?.tiktok || "",
            youtube: store.contact?.social?.youtube || "",
          },
        },
        description: store.description || "",
        isPublished: store.isPublished ?? false,
      });
    }
  }, [store]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("contact.social.")) {
      const socialKey = name.split(".")[2];
      setForm((prev) => ({
        ...prev,
        contact: {
          ...prev.contact,
          social: {
            ...prev.contact.social,
            [socialKey]: value,
          },
        },
      }));
    } else if (name.startsWith("contact.")) {
      const contactKey = name.split(".")[1];
      setForm((prev) => ({
        ...prev,
        contact: {
          ...prev.contact,
          [contactKey]: value,
        },
      }));
    } else if (name === "isPublished") {
      // Narrow type to HTMLInputElement for checkbox
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({ ...prev, isPublished: checked }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleWhyChooseUsChange = (idx: number, value: string) => {
    setForm((prev) => {
      const arr = [...prev.whyChooseUs];
      arr[idx] = value;
      return { ...prev, whyChooseUs: arr };
    });
  };

  const addWhyChooseUs = () => {
    setForm((prev) => ({ ...prev, whyChooseUs: [...prev.whyChooseUs, ""] }));
  };

  const removeWhyChooseUs = (idx: number) => {
    setForm((prev) => {
      const arr = [...prev.whyChooseUs];
      arr.splice(idx, 1);
      return { ...prev, whyChooseUs: arr };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex items-center gap-2">
        <Settings className="text-gray-500" />
        <CardTitle>Store Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Store Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store Name
            </label>
            <input
              type="text"
              name="storeName"
              value={form.storeName}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="Enter store name"
            />
          </div>
          {/* Subdomain */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subdomain
            </label>
            <input
              type="text"
              name="subdomain"
              value={form.subdomain}
              className="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="e.g. mystore"
              disabled
            />
          </div>
          {/* Store Landing Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Store Landing Image
            </label>
            <div className="flex gap-2 items-center">
              {form.storeLandingImage ? (
                <div className="relative group w-24 h-24">
                  <Image
                    src={form.storeLandingImage}
                    alt="Store landing preview"
                    width={96}
                    height={96}
                    className="object-cover rounded border"
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full p-0.5 text-xs text-red-500 opacity-80 group-hover:opacity-100"
                    onClick={() =>
                      setForm((prev) => ({ ...prev, storeLandingImage: "" }))
                    }
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50 transition group relative">
                  {isImageUploading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/70 rounded">
                      <svg
                        className="animate-spin h-6 w-6 text-gray-400"
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
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        ></path>
                      </svg>
                    </div>
                  ) : (
                    <>
                      <UploadCloud className="w-6 h-6 text-gray-400 group-hover:text-gray-600" />
                      <span className="text-xs text-gray-500 group-hover:text-gray-700">
                        Upload
                      </span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      if (!e.target.files || !e.target.files[0]) return;
                      setIsImageUploading(true);
                      const file = e.target.files[0];
                      const formData = new FormData();
                      formData.append("file", file);
                      const res = await fetch("/api/upload", {
                        method: "POST",
                        body: formData,
                      });
                      const data = await res.json();
                      if (data.url) {
                        setForm((prev) => ({
                          ...prev,
                          storeLandingImage: data.url,
                        }));
                      }
                      setIsImageUploading(false);
                      e.target.value = "";
                    }}
                  />
                </label>
              )}
            </div>
          </div>
          {/* Hero Heading */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hero Heading
            </label>
            <input
              type="text"
              name="heroHeading"
              value={form.heroHeading}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="Main headline for your store"
            />
          </div>
          {/* Hero Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Hero Description
            </label>
            <textarea
              name="heroDescription"
              value={form.heroDescription}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="Short description for your store homepage"
              rows={2}
            />
          </div>
          {/* About Us */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              About Us
            </label>
            <textarea
              name="aboutUs"
              value={form.aboutUs}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="Tell customers about your store"
              rows={3}
            />
          </div>
          {/* Why Choose Us (array) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Why Choose Us
            </label>
            {form.whyChooseUs.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-1">
                <input
                  type="text"
                  value={item}
                  onChange={(e) => handleWhyChooseUsChange(idx, e.target.value)}
                  className="flex-1 border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                  placeholder={`Reason #${idx + 1}`}
                />
                {form.whyChooseUs.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeWhyChooseUs(idx)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addWhyChooseUs}
              className="text-blue-600 text-sm mt-1"
            >
              + Add Reason
            </button>
          </div>
          {/* Contact Info */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Email
            </label>
            <input
              type="email"
              name="contact.email"
              value={form.contact.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="Email address"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Phone
            </label>
            <input
              type="text"
              name="contact.phone"
              value={form.contact.phone}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="Phone number"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contact Address
            </label>
            <input
              type="text"
              name="contact.address"
              value={form.contact.address}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="Physical address"
            />
          </div>
          {/* Social Links */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Social Links
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                name="contact.social.instagram"
                value={form.contact.social.instagram}
                onChange={handleChange}
                className="border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                placeholder="Instagram"
              />
              <input
                type="text"
                name="contact.social.facebook"
                value={form.contact.social.facebook}
                onChange={handleChange}
                className="border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                placeholder="Facebook"
              />
              <input
                type="text"
                name="contact.social.twitter"
                value={form.contact.social.twitter}
                onChange={handleChange}
                className="border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                placeholder="Twitter"
              />
              <input
                type="text"
                name="contact.social.tiktok"
                value={form.contact.social.tiktok}
                onChange={handleChange}
                className="border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                placeholder="TikTok"
              />
              <input
                type="text"
                name="contact.social.youtube"
                value={form.contact.social.youtube}
                onChange={handleChange}
                className="border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                placeholder="YouTube"
              />
            </div>
          </div>
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Short Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
              placeholder="Short description for SEO, etc."
              rows={2}
            />
          </div>
          {/* Published */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              name="isPublished"
              checked={form.isPublished}
              onChange={handleChange}
              className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-2 focus:ring-gray-300"
            />
            <label className="text-sm font-medium text-gray-700">
              Published
            </label>
          </div>
          <button
            type="submit"
            className="px-4 py-2 rounded bg-gray-900 text-white font-semibold hover:bg-gray-700 transition"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save Changes"}
          </button>
          {mutation.isSuccess && (
            <div className="text-green-600 mt-2">
              Store updated successfully!
            </div>
          )}
          {mutation.isError && (
            <div className="text-red-600 mt-2">
              Failed to update store. Please try again.
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
