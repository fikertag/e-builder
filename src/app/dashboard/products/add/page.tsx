"use client";

import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { PackagePlus, UploadCloud } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useStoreData } from "@/store/useStoreData";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import Image from "next/image";

export default function AddProductPage() {
  const stores = useStoreData((state) => state.stores);
  const selectedStoreId = useStoreData((state) => state.selectedStoreId);
  const store = stores.find((s) => s.id === selectedStoreId);

  // Delivery Fee State
  const [deliveryFeeType, setDeliveryFeeType] = useState<
    "default" | "custom" | "free"
  >("default");
  const [customDeliveryFees, setCustomDeliveryFees] = useState([
    { location: "", price: 0 },
  ]);
  // Delivery Fee Handlers
  const handleCustomDeliveryFeeChange = (
    idx: number,
    field: "location" | "price",
    value: string | number
  ) => {
    setCustomDeliveryFees((prev) => {
      const arr = [...prev];
      arr[idx] = { ...arr[idx], [field]: value };
      return arr;
    });
  };
  const addCustomDeliveryFee = () => {
    setCustomDeliveryFees((prev) => [...prev, { location: "", price: 0 }]);
  };
  const removeCustomDeliveryFee = (idx: number) => {
    setCustomDeliveryFees((prev) => {
      const arr = [...prev];
      arr.splice(idx, 1);
      return arr;
    });
  };

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
  const [variants, setVariants] = useState<
    {
      name: string;
      type: string;
      sku: string;
      priceAdjustment: string;
      inventory: string;
      image: string;
      imageUploading?: boolean;
    }[]
  >([
    {
      name: "",
      type: "",
      sku: "",
      priceAdjustment: "",
      inventory: "",
      image: "",
      imageUploading: false,
    },
  ]);
  const [customOptions, setCustomOptions] = useState([
    { name: "", type: "text", required: false, choices: [""], priceImpact: "" },
  ]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categoryOptions, setCategoryOptions] = useState<string[]>([]);
  const [isProductImageUploading, setIsProductImageUploading] = useState(false);
  const [attrKey, setAttrKey] = useState("");
  const [attrValue, setAttrValue] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Fetch categories for the store
  useEffect(() => {
    async function fetchCategories() {
      if (!store?.id) return;
      try {
        const res = await fetch(`/api/catagory/${store.id}`);
        if (res.ok) {
          const cats: { name: string }[] = await res.json();
          setCategoryOptions(
            Array.isArray(cats) ? cats.map((c) => c.name) : []
          );
        }
      } catch {}
    }
    fetchCategories();
  }, [store?.id]);

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
    onSuccess: (data) => {
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
          imageUploading: false,
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
      toast("Product '" + (data?.title || title) + "' created successfully!");
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
    // Delivery fee logic
    let deliveryFees = undefined;
    let isFreeDelivery = false;
    if (deliveryFeeType === "custom") {
      deliveryFees = customDeliveryFees.filter(
        (fee) => fee.location && fee.location.trim() !== ""
      );
    } else if (deliveryFeeType === "free") {
      isFreeDelivery = true;
    }
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
      deliveryFees,
      isFreeDelivery,
      useDefaultDeliveryFees: deliveryFeeType === "default",
    });
  }

  const handleAddAttribute = () => {
    const key = attrKey.trim();
    const value = attrValue.trim();
    if (!key || !value) return;
    if (attributes.some((a) => a.key === key)) return;
    setAttributes((prev) => [...prev, { key, value }]);
    setAttrKey("");
    setAttrValue("");
  };

  const handleEditAttribute = (idx: number, key: string, value: string) => {
    setAttributes((prev) =>
      prev.map((a, i) => (i === idx ? { key, value } : a))
    );
  };
  const handleRemoveAttribute = (idx: number) => {
    setAttributes((prev) => prev.filter((_, i) => i !== idx));
  };

  // Helper to map categoryOptions to Option[]
  const categorySelectOptions: Option[] = categoryOptions.map((cat) => ({
    label: cat,
    value: cat,
  }));

  return (
    <Card className="w-full max-w-2xl mx-auto mb-4">
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
              Product Images
            </label>
            <div className="flex gap-2 flex-wrap items-center">
              {images.map((img, i) => (
                <div key={i} className="relative group w-16 h-16">
                  <Image
                    src={img}
                    alt="preview"
                    width={64}
                    height={64}
                    className="object-cover rounded border"
                  />
                  <button
                    type="button"
                    className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full p-0.5 text-xs text-red-500 opacity-80 group-hover:opacity-100"
                    onClick={() =>
                      setImages(images.filter((_, idx) => idx !== i))
                    }
                    title="Remove image"
                  >
                    ×
                  </button>
                </div>
              ))}
              <label className="flex flex-col items-center justify-center w-16 h-16 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50 transition group relative">
                {isProductImageUploading ? (
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
                  multiple
                  className="hidden"
                  onChange={async (e) => {
                    if (!e.target.files) return;
                    setIsProductImageUploading(true);
                    const files = Array.from(e.target.files);
                    const uploaded: string[] = [];
                    for (const file of files) {
                      const formData = new FormData();
                      formData.append("file", file);
                      const res = await fetch("/api/upload", {
                        method: "POST",
                        body: formData,
                      });
                      const data = await res.json();
                      if (data.url) uploaded.push(data.url);
                    }
                    setImages((prev) => [...prev, ...uploaded]);
                    setIsProductImageUploading(false);
                    e.target.value = ""; // reset input
                  }}
                />
              </label>
            </div>
          </div>
          {/* Categories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Categories
            </label>
            <MultipleSelector
              options={categorySelectOptions}
              placeholder="Select or create categories..."
              creatable
              value={categories.map((cat) => ({ label: cat, value: cat }))}
              onChange={(opts: Option[]) =>
                setCategories(opts.map((o) => o.value))
              }
              emptyIndicator={
                <p className="text-center text-sm leading-10 text-gray-600 dark:text-gray-400">
                  No results found.
                </p>
              }
              className="w-full"
            />
          </div>
          {/* Delivery Fee Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Delivery Fee
            </label>
            <div className="flex flex-col sm:flex-row sm:gap-4 mb-2">
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="deliveryFeeType"
                  value="default"
                  checked={deliveryFeeType === "default"}
                  onChange={() => setDeliveryFeeType("default")}
                />
                Use store default
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="deliveryFeeType"
                  value="custom"
                  checked={deliveryFeeType === "custom"}
                  onChange={() => setDeliveryFeeType("custom")}
                />
                Custom
              </label>
              <label className="flex items-center gap-1">
                <input
                  type="radio"
                  name="deliveryFeeType"
                  value="free"
                  checked={deliveryFeeType === "free"}
                  onChange={() => setDeliveryFeeType("free")}
                />
                Free Delivery
              </label>
            </div>
            {deliveryFeeType === "custom" && (
              <div className="space-y-1">
                {(customDeliveryFees || []).map((fee, idx) => (
                  <div key={idx} className="flex items-center gap-2 mb-1">
                    <input
                      type="text"
                      value={fee.location}
                      onChange={(e) =>
                        handleCustomDeliveryFeeChange(
                          idx,
                          "location",
                          e.target.value
                        )
                      }
                      className="flex-1 border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                      placeholder="Location"
                    />
                    <input
                      type="number"
                      min={0}
                      value={fee.price}
                      onChange={(e) =>
                        handleCustomDeliveryFeeChange(
                          idx,
                          "price",
                          Number(e.target.value)
                        )
                      }
                      className="w-28 border rounded px-3 py-2 text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300"
                      placeholder="Fee"
                    />
                    {customDeliveryFees.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeCustomDeliveryFee(idx)}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addCustomDeliveryFee}
                  className="text-blue-600 text-sm mt-1"
                >
                  + Add Delivery Fee
                </button>
              </div>
            )}
            {deliveryFeeType === "default" && (
              <div className="text-xs text-gray-500 mt-1">
                Will use the store&apos;s default delivery fees.
              </div>
            )}
            {deliveryFeeType === "free" && (
              <div className="text-xs text-green-600 mt-1">
                This product will have free delivery.
              </div>
            )}
          </div>
          {/* isFeatured, isActive */}
          <div className="flex gap-4 mt-5">
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
          {/* Advanced Options Toggle */}
          <div className="mt-4">
            <button
              type="button"
              className="text-blue-600 underline text-sm"
              onClick={() => setShowAdvanced((v) => !v)}
            >
              {showAdvanced ? "Hide Advanced Options" : "Show Advanced Options"}
            </button>
          </div>
          {showAdvanced && (
            <>
              {/* Attributes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attributes
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    className="border rounded px-2 py-1 text-sm flex-1"
                    placeholder="Key"
                    value={attrKey}
                    onChange={(e) => setAttrKey(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddAttribute();
                      }
                    }}
                    aria-label="Attribute key"
                  />
                  <input
                    type="text"
                    className="border rounded px-2 py-1 text-sm flex-1"
                    placeholder="Value"
                    value={attrValue}
                    onChange={(e) => setAttrValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddAttribute();
                      }
                    }}
                    aria-label="Attribute value"
                  />
                  <button
                    type="button"
                    className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition"
                    disabled={
                      !attrKey.trim() ||
                      !attrValue.trim() ||
                      attributes.some((a) => a.key === attrKey.trim())
                    }
                    onClick={handleAddAttribute}
                    aria-label="Add attribute"
                  >
                    + Add
                  </button>
                </div>
                {attributes.length > 0 && (
                  <div className="flex flex-col gap-2 mt-2">
                    {attributes.map((a, idx) => (
                      <div key={a.key} className="flex gap-2 items-center">
                        <input
                          type="text"
                          className="border rounded px-2 py-1 text-sm w-32"
                          value={a.key}
                          onChange={(e) =>
                            handleEditAttribute(idx, e.target.value, a.value)
                          }
                          aria-label={`Edit key for attribute ${a.key}`}
                        />
                        <span className="text-gray-500">:</span>
                        <input
                          type="text"
                          className="border rounded px-2 py-1 text-sm w-32"
                          value={a.value}
                          onChange={(e) =>
                            handleEditAttribute(idx, a.key, e.target.value)
                          }
                          aria-label={`Edit value for attribute ${a.key}`}
                        />
                        <button
                          type="button"
                          className="ml-1 text-red-500 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 rounded-full px-2 py-1 text-xs"
                          onClick={() => handleRemoveAttribute(idx)}
                          title="Remove"
                          aria-label={`Remove attribute ${a.key}`}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-xs text-gray-500 mt-1">
                  Add key/value pairs (e.g.{" "}
                  <span className="font-mono">color</span> :{" "}
                  <span className="font-mono">red</span>)
                </div>
              </div>
              {/* Variants */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Variants
                </label>

                {variants.map((variant, idx) => (
                  <div
                    key={idx}
                    className="flex flex-wrap gap-2 mb-2 items-center"
                  >
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
                            i === idx
                              ? { ...v2, inventory: e.target.value }
                              : v2
                          )
                        )
                      }
                    />
                    {/* Variant Image Upload with spinner */}
                    {variant.imageUploading ? (
                      <div className="relative flex items-center justify-center w-12 h-12 border-2 border-dashed border-gray-300 rounded bg-gray-50">
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
                    ) : variant.image ? (
                      <div className="relative group w-12 h-12">
                        <Image
                          src={variant.image}
                          alt="variant preview"
                          height={48}
                          width={48}
                          className="object-cover rounded border"
                        />
                        <button
                          type="button"
                          className="absolute -top-2 -right-2 bg-white border border-gray-300 rounded-full p-0.5 text-xs text-red-500 opacity-80 group-hover:opacity-100"
                          onClick={() =>
                            setVariants((v) =>
                              v.map((v2, i) =>
                                i === idx ? { ...v2, image: "" } : v2
                              )
                            )
                          }
                          title="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <label className="flex flex-col items-center justify-center w-12 h-12 border-2 border-dashed border-gray-300 rounded cursor-pointer hover:bg-gray-50 transition group">
                        <UploadCloud className="w-5 h-5 text-gray-400 group-hover:text-gray-600" />
                        <span className="text-[10px] text-gray-500 group-hover:text-gray-700">
                          Upload
                        </span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={async (e) => {
                            if (!e.target.files) return;
                            setVariants((v) =>
                              v.map((v2, i) =>
                                i === idx ? { ...v2, imageUploading: true } : v2
                              )
                            );
                            const file = e.target.files[0];
                            const formData = new FormData();
                            formData.append("file", file);
                            const res = await fetch("/api/upload", {
                              method: "POST",
                              body: formData,
                            });
                            const data = await res.json();
                            setVariants((v) =>
                              v.map((v2, i) =>
                                i === idx
                                  ? {
                                      ...v2,
                                      image: data.url || "",
                                      imageUploading: false,
                                    }
                                  : v2
                              )
                            );
                            e.target.value = "";
                          }}
                        />
                      </label>
                    )}
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
                <div className="text-xs text-gray-500 mb-2">
                  name: &quot;Red&quot; , type: &quot;Color&quot; , sku:
                  &quot;TSHIRT-RED&quot; , priceAdjustment: &quot;0&quot; ,
                  inventory: &quot;10&quot;
                </div>
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
                        imageUploading: false,
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
                <div className="text-xs text-gray-500 mb-2">
                  Custom options let customers choose extra things at checkout
                  (not tracked in inventory). <br />
                  <b>Example:</b> Engraving text, gift wrap color, etc. Can be
                  text or dropdown.
                </div>
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
                              i === idx
                                ? { ...o2, required: e.target.checked }
                                : o2
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
                            i === idx
                              ? { ...o2, priceImpact: e.target.value }
                              : o2
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
            </>
          )}
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {success && <div className="text-green-600 text-sm">{success}</div>}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded bg-gray-900 text-white font-semibold hover:bg-gray-700 transition disabled:cursor-not-allowed disabled:bg-gray-500"
              disabled={
                mutation.status === "pending" || isProductImageUploading
              }
            >
              {mutation.status === "pending" ? "Adding..." : "Add Product"}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
