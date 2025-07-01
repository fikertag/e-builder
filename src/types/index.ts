export interface ICustomOption {
  name: string; // "Engraving Text"
  type: "text" | "dropdown";
  required: boolean;
  choices?: string[]; // Only for type "dropdown"
  priceImpact?: number; // Additional cost
}

export interface IVariant {
  name: string; // "Small", "Red", "Cotton"
  type?: string; // "size", "color", "material" (optional)
  sku: string; // "TSHIRT-RED-SM"
  priceAdjustment?: number; // +$5 for this variant
  inventory: number;
  image?: string; // Variant-specific image
}

export interface IProduct {
  _id: string; // Unique identifier
  store: string; // Reference to Store
  title: string;
  description: string;
  basePrice: number; // Starting price before variants
  variants: IVariant[];
  categories: string[]; // Reference to Categories
  images: string[]; // Main product images
  isFeatured: boolean;
  isActive: boolean; // Soft delete
  attributes: {
    // Flexible metadata
    [key: string]: string | number | boolean | undefined; // { "gender": "unisex", "weight": "200g" }
  };
  customOptions?: ICustomOption[];
  updatedAt?: string; // Optional, for tracking updates
}
export interface IAIBrandConfig {
  colorPalette: {
    primary: string;
    secondary: string;
    accent: string;
  };
  typography: {
    heading: string;
    body: string;
  };
  layoutTemplate: "minimalist" | "professional" | "vibrant";
}

export interface StoreIntegrations {
  telebirr?: {
    number: string;
    name: string;
  };
  cbe?: {
    account: string;
    name: string;
  };
}

export interface StoreData {
  id: string;
  owner: string;
  subdomain: string;
  storeName: string;
  description: string;
  aiConfig: IAIBrandConfig;
  generatedAt?: string;
  isPublished: boolean;
  heroHeading: string;
  heroDescription: string;
  storeLandingImage: string;
  aboutUs: string;
  whyChooseUs: string[];
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
  integrations?: StoreIntegrations;
}

export interface CartItem {
  product: IProduct;
  quantity: number;
  selectedVariants?: IVariant[]; // Chosen variants for this cart item
  selectedCustomOptions?: { [optionName: string]: string }; // User's custom option selections
}

export interface CartItem {
  product: IProduct;
  quantity: number;
  selectedVariants?: IVariant[];
  selectedCustomOptions?: { [optionName: string]: string };
}

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null | undefined;
  role: string | null | undefined;
  roles: string | null | undefined;
  storeId?: string;
  banned?: boolean;
  banReason?: string | null;
  banExpires?: Date | null;
}
