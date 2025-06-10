export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
}

export interface ICustomOption {
  name: string;             // "Engraving Text"
  type: 'text' | 'dropdown';
  required: boolean;
  choices?: string[];       // Only for type "dropdown"
  priceImpact?: number;     // Additional cost
}

export interface IVariant {
  name: string;               // "Small", "Red", "Cotton"
  type?: string;              // "size", "color", "material" (optional)
  sku: string;                // "TSHIRT-RED-SM"
  priceAdjustment?: number;   // +$5 for this variant
  inventory: number;
  image?: string;             // Variant-specific image
}

export interface IProduct  {
 _id: string; // Unique identifier
  store: string; // Reference to Store
  title: string;
  description: string;
  basePrice: number;          // Starting price before variants
  variants: IVariant[];
  categories: string[]; // Reference to Categories
  images: string[];           // Main product images
  isFeatured: boolean;
  isActive: boolean;          // Soft delete
  attributes: {               // Flexible metadata
    [key: string]: string | number | boolean | undefined; // { "gender": "unisex", "weight": "200g" }
  };
  customOptions?: ICustomOption[];
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
  layoutTemplate: 'minimalist' | 'professional' | 'vibrant';
}


export interface StoreData {
  _id: string; 
  owner: string; 
  subdomain: string;
  storeName: string;
  description: string;
  aiConfig: IAIBrandConfig;
  generatedAt?: string; 
  isPublished: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export type CartContextType = {
  cart: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
};