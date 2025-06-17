import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IProduct, IVariant, CartItem } from '@/types/index';

interface CartState {
  items: CartItem[];
  addToCart: (
    product: IProduct,
    quantity?: number,
    selectedVariants?: IVariant[],
    selectedCustomOptions?: { [optionName: string]: string }
  ) => void;
  removeFromCart: (
    productId: string,
    selectedVariants?: IVariant[],
    selectedCustomOptions?: { [optionName: string]: string }
  ) => void;
  updateQuantity: (
    productId: string,
    quantity: number,
    selectedVariants?: IVariant[],
    selectedCustomOptions?: { [optionName: string]: string }
  ) => void;
  clearCart: () => void;
}

function areVariantsEqual(a?: IVariant[], b?: IVariant[]) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  return a.every((v, i) => v.sku === b[i].sku);
}

function areOptionsEqual(a?: { [optionName: string]: string }, b?: { [optionName: string]: string }) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);
  if (aKeys.length !== bKeys.length) return false;
  return aKeys.every((key) => a[key] === b[key]);
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addToCart: (product, quantity = 1, selectedVariants, selectedCustomOptions) =>
        set((state) => {
          const existing = state.items.find((item) =>
            item.product._id === product._id &&
            areVariantsEqual(item.selectedVariants, selectedVariants) &&
            areOptionsEqual(item.selectedCustomOptions, selectedCustomOptions)
          );
          if (existing) {
            return {
              items: state.items.map((item) =>
                item.product._id === product._id &&
                areVariantsEqual(item.selectedVariants, selectedVariants) &&
                areOptionsEqual(item.selectedCustomOptions, selectedCustomOptions)
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          return {
            items: [
              ...state.items,
              { product, quantity, selectedVariants, selectedCustomOptions },
            ],
          };
        }),
      removeFromCart: (productId, selectedVariants, selectedCustomOptions) =>
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.product._id === productId &&
                areVariantsEqual(item.selectedVariants, selectedVariants) &&
                areOptionsEqual(item.selectedCustomOptions, selectedCustomOptions)
              )
          ),
        })),
      updateQuantity: (productId, quantity, selectedVariants, selectedCustomOptions) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.product._id === productId &&
            areVariantsEqual(item.selectedVariants, selectedVariants) &&
            areOptionsEqual(item.selectedCustomOptions, selectedCustomOptions)
              ? { ...item, quantity }
              : item
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'cart-store', // Single key for all stores
    }
  )
);

export const selectTotalItems = (state: CartState) => state.items.reduce((sum, item) => sum + item.quantity, 0);
