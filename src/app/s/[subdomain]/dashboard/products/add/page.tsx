"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PackagePlus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useStoreData } from "@/store/useStoreData";

export default function AddProductPage() {
  const store = useStoreData((state) => state.store);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [basePrice, setBasePrice] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [attributes, setAttributes] = useState<
    { key: string; value: string }[]
  >([]);
  // Variants
  const [variants, setVariants] = useState([
    {
      name: "",
      type: "",
      sku: "",
      priceAdjustment: "",
      inventory: "",
      image: "",
    },
  ]);
  // Custom Options
  const [customOptions, setCustomOptions] = useState([
    { name: "", type: "text", required: false, choices: [""], priceImpact: "" },
  ]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const mutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      if (!data.variants) data.variants = [];
      if (!data.customOptions) data.customOptions = [];
      const res = await fetch("/api/product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(
          typeof err.message === "string"
            ? err.message
            : "Failed to add product"
        );
      }
      return res.json();
    },
    onSuccess: () => {
      setSuccess("Product added!");
      setTitle("");
      setDescription("");
      setBasePrice("");
      setImages([]);
      setIsFeatured(false);
      setIsActive(true);
      setCategories([]);
      setAttributes([]);
      setVariants([
        {
          name: "",
          type: "",
          sku: "",
          priceAdjustment: "",
          inventory: "",
          image: "",
        },
      ]);
      setCustomOptions([
        {
          name: "",
          type: "text",
          required: false,
          choices: [""],
          priceImpact: "",
        },
      ]);
    },
    onError: (err: unknown) => {
      if (err instanceof Error) setError(err.message);
      else setError("Failed to add product");
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!store?.id) return setError("Store not found.");
    if (!title || !description || !basePrice || images.length === 0)
      return setError("All fields and at least one image are required.");
    if (description.length < 30)
      return setError("Description must be at least 30 characters.");
    mutation.mutate({
      store: store.id,
      title,
      description,
      basePrice: Number(basePrice),
      images,
      isFeatured,
      isActive,
      categories,
      attributes: Object.fromEntries(attributes.map((a) => [a.key, a.value])),
      variants: variants.filter((v) => v.name && v.sku),
      customOptions: customOptions.filter((o) => o.name),
    });
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="flex items-center gap-2">
        <PackagePlus className="text-gray-500" />
        <CardTitle>Add Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Title, Price, Description, Images */}
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
          {/* isFeatured, isActive */}
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => setIsFeatured(e.target.checked)}
              />{" "}
              Featured
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />{" "}
              Active
            </label>
          </div>
          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categories (IDs, comma separated)
            </label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={categories.join(",")}
              onChange={(e) =>
                setCategories(
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean)
                )
              }
              placeholder="categoryId1, categoryId2"
            />
          </div>
          {/* Attributes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Attributes (key:value, one per line)
            </label>
            <textarea
              className="w-full border rounded px-3 py-2"
              value={attributes.map((a) => `${a.key}:${a.value}`).join("\n")}
              onChange={(e) =>
                setAttributes(
                  e.target.value
                    .split("\n")
                    .map((line) => {
                      const [key, ...rest] = line.split(":");
                      return key && rest.length
                        ? { key: key.trim(), value: rest.join(":").trim() }
                        : null;
                    })
                    .filter(Boolean) as { key: string; value: string }[]
                )
              }
              placeholder="color: red\nmaterial: cotton"
              rows={2}
            />
          </div>
          {/* Variants */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Variants
            </label>
            {variants.map((variant, idx) => (
              <div key={idx} className="flex flex-wrap gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Name"
                  className="border rounded px-2 py-1 w-24"
                  value={variant.name}
                  onChange={(e) =>
                    setVariants((v) =>
                      v.map((v2, i) =>
                        i === idx ? { ...v2, name: e.target.value } : v2
                      )
                    )
                  }
                />
                <input
                  type="text"
                  placeholder="Type"
                  className="border rounded px-2 py-1 w-20"
                  value={variant.type}
                  onChange={(e) =>
                    setVariants((v) =>
                      v.map((v2, i) =>
                        i === idx ? { ...v2, type: e.target.value } : v2
                      )
                    )
                  }
                />
                <input
                  type="text"
                  placeholder="SKU"
                  className="border rounded px-2 py-1 w-24"
                  value={variant.sku}
                  onChange={(e) =>
                    setVariants((v) =>
                      v.map((v2, i) =>
                        i === idx ? { ...v2, sku: e.target.value } : v2
                      )
                    )
                  }
                />
                <input
                  type="number"
                  placeholder="Price Adj."
                  className="border rounded px-2 py-1 w-20"
                  value={variant.priceAdjustment}
                  onChange={(e) =>
                    setVariants((v) =>
                      v.map((v2, i) =>
                        i === idx
                          ? { ...v2, priceAdjustment: e.target.value }
                          : v2
                      )
                    )
                  }
                />
                <input
                  type="number"
                  placeholder="Inventory"
                  className="border rounded px-2 py-1 w-20"
                  value={variant.inventory}
                  onChange={(e) =>
                    setVariants((v) =>
                      v.map((v2, i) =>
                        i === idx ? { ...v2, inventory: e.target.value } : v2
                      )
                    )
                  }
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  className="border rounded px-2 py-1 w-32"
                  value={variant.image}
                  onChange={(e) =>
                    setVariants((v) =>
                      v.map((v2, i) =>
                        i === idx ? { ...v2, image: e.target.value } : v2
                      )
                    )
                  }
                />
                <button
                  type="button"
                  className="text-red-500 ml-2"
                  onClick={() =>
                    setVariants((v) => v.filter((_, i) => i !== idx))
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="text-blue-600 text-xs mt-1"
              onClick={() =>
                setVariants((v) => [
                  ...v,
                  {
                    name: "",
                    type: "",
                    sku: "",
                    priceAdjustment: "",
                    inventory: "",
                    image: "",
                  },
                ])
              }
            >
              + Add Variant
            </button>
          </div>
          {/* Custom Options */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custom Options
            </label>
            {customOptions.map((option, idx) => (
              <div key={idx} className="flex flex-wrap gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Name"
                  className="border rounded px-2 py-1 w-24"
                  value={option.name}
                  onChange={(e) =>
                    setCustomOptions((o) =>
                      o.map((o2, i) =>
                        i === idx ? { ...o2, name: e.target.value } : o2
                      )
                    )
                  }
                />
                <select
                  className="border rounded px-2 py-1 w-20"
                  value={option.type}
                  onChange={(e) =>
                    setCustomOptions((o) =>
                      o.map((o2, i) =>
                        i === idx ? { ...o2, type: e.target.value } : o2
                      )
                    )
                  }
                >
                  <option value="text">Text</option>
                  <option value="dropdown">Dropdown</option>
                </select>
                <label className="flex items-center gap-1 text-xs">
                  <input
                    type="checkbox"
                    checked={option.required}
                    onChange={(e) =>
                      setCustomOptions((o) =>
                        o.map((o2, i) =>
                          i === idx ? { ...o2, required: e.target.checked } : o2
                        )
                      )
                    }
                  />{" "}
                  Required
                </label>
                <input
                  type="text"
                  placeholder="Choices (comma)"
                  className="border rounded px-2 py-1 w-32"
                  value={option.choices?.join(",") || ""}
                  onChange={(e) =>
                    setCustomOptions((o) =>
                      o.map((o2, i) =>
                        i === idx
                          ? {
                              ...o2,
                              choices: e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            }
                          : o2
                      )
                    )
                  }
                  disabled={option.type !== "dropdown"}
                />
                <input
                  type="number"
                  placeholder="Price Impact"
                  className="border rounded px-2 py-1 w-20"
                  value={option.priceImpact}
                  onChange={(e) =>
                    setCustomOptions((o) =>
                      o.map((o2, i) =>
                        i === idx ? { ...o2, priceImpact: e.target.value } : o2
                      )
                    )
                  }
                />
                <button
                  type="button"
                  className="text-red-500 ml-2"
                  onClick={() =>
                    setCustomOptions((o) => o.filter((_, i) => i !== idx))
                  }
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              className="text-blue-600 text-xs mt-1"
              onClick={() =>
                setCustomOptions((o) => [
                  ...o,
                  {
                    name: "",
                    type: "text",
                    required: false,
                    choices: [""],
                    priceImpact: "",
                  },
                ])
              }
            >
              + Add Option
            </button>
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <button
            type="submit"
            className="px-4 py-2 rounded bg-gray-900 text-white font-semibold hover:bg-gray-700 transition"
            disabled={mutation.status === "pending"}
          >
            {mutation.status === "pending" ? "Adding..." : "Add Product"}
          </button>
        </form>
      </CardContent>
    </Card>
  );
}
