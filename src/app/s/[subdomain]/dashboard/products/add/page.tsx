"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PackagePlus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useStoreData } from "@/store/useStoreData";

export default function AddProductPage() {
  const store = useStoreData((state) => state.store);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const mutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch("/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok)
        throw new Error((await res.json()).message || "Failed to add product");
      return res.json();
    },
    onSuccess: () => {
      setSuccess("Product added!");
      setTitle("");
      setDescription("");
      setBasePrice("");
      setImages([]);
    },
    onError: (err: any) => setError(err.message),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    // if (!store?.id) return setError("Store not found.");
    if (!title || !description || !basePrice || images.length === 0)
      return setError("All fields and at least one image are required.");
    if (description.length < 30)
      return setError("Description must be at least 30 characters.");
    mutation.mutate({
      store: store?.id,
      title,
      description,
      basePrice: Number(basePrice),
      images,
      // Add other fields as needed (variants, categories, etc.)
    });
  }

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader className="flex items-center gap-2">
        <PackagePlus className="text-gray-500" />
        <CardTitle>Add Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter product name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price
            </label>
            <input
              type="number"
              className="w-full border rounded px-3 py-2"
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              placeholder="Enter price"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="w-full border rounded px-3 py-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Image URLs (comma separated)
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={images.join(",")}
              onChange={(e) =>
                setImages(
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              }
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
            />
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button
            type="submit"
            className="px-4 py-2 rounded bg-gray-900 text-white font-semibold hover:bg-gray-700 transition"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Adding..." : "Add Product"}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
