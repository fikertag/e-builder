import { ShoppingCartIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";

const CartSheetContent = () => {
  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  return (
    <div className="flex h-full flex-col">
      {items.length === 0 ? (
        <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
          <ShoppingCartIcon className="h-16 text-muted-foreground" />
          <p className="mt-6 text-center text-2xl font-bold text-foreground">
            Your cart is empty.
          </p>
        </div>
      ) : (
        <div className="flex h-full flex-col justify-between overflow-hidden p-1">
          <ul className="overflow-y-scroll h-[300px]">
            {items.map((item, i) => (
              <li
                key={i}
                className="flex w-full flex-col border-b border-border"
              >
                <div className="relative flex w-full flex-row justify-between px-1 py-4">
                  <div className="absolute z-40 -ml-1 -mt-2">
                    <button
                      className="rounded-full bg-muted p-1 text-muted-foreground hover:bg-muted/80"
                      onClick={() =>
                        removeFromCart(
                          item.product._id,
                          item.selectedVariants,
                          item.selectedCustomOptions
                        )
                      }
                      aria-label="Remove from cart"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M18 6L6 18" />
                        <path d="M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex flex-row">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md border border-border bg-muted">
                      <Image
                        className="h-full w-full "
                        width={64}
                        height={64}
                        style={{ objectFit: "contain" }}
                        alt={item.product.title}
                        src={
                          // Show variant image if available, else main product image
                          item.selectedVariants &&
                          item.selectedVariants.length > 0 &&
                          item.selectedVariants[0].image
                            ? item.selectedVariants[0].image
                            : item.product.images[0]?.startsWith("http")
                            ? item.product.images[0]
                            : "/placeholder.png"
                        }
                      />
                    </div>
                    <Link
                      href={`/product/${item.product._id}`}
                      className="z-30 ml-2 flex flex-row space-x-4"
                    >
                      <div className="flex flex-1 flex-col text-base">
                        <span className="leading-tight text-card-foreground">
                          {item.product.title}
                        </span>
                        {/* Show selected variants/options if any */}
                        {item.selectedVariants &&
                          item.selectedVariants.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                              {item.selectedVariants
                                .map((v) => v.name)
                                .join(", ")}
                            </p>
                          )}
                        {item.selectedCustomOptions &&
                          Object.keys(item.selectedCustomOptions).length >
                            0 && (
                            <p className="text-xs text-muted-foreground/70">
                              {Object.entries(item.selectedCustomOptions)
                                .map(([k, v]) => `${k}: ${v}`)
                                .join(", ")}
                            </p>
                          )}
                      </div>
                    </Link>
                  </div>
                  <div className="flex h-16 flex-col justify-between">
                    <div className="flex justify-end space-y-2 text-right text-sm text-foreground">
                      ${item.product.basePrice.toFixed(2)}
                    </div>
                    <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-border">
                      <button
                        className="px-3 text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          updateQuantity(
                            item.product._id,
                            Math.max(1, item.quantity - 1),
                            item.selectedVariants,
                            item.selectedCustomOptions
                          )
                        }
                        disabled={item.quantity <= 1}
                        aria-label="Decrease quantity"
                      >
                        -
                      </button>
                      <p className="w-6 text-center">
                        <span className="w-full text-sm text-foreground">{item.quantity}</span>
                      </p>
                      <button
                        className="px-3 text-muted-foreground hover:text-foreground"
                        onClick={() =>
                          updateQuantity(
                            item.product._id,
                            item.quantity + 1,
                            item.selectedVariants,
                            item.selectedCustomOptions
                          )
                        }
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CartSheetContent;
