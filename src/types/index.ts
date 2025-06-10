export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
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