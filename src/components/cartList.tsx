import { ShoppingCartIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const CartSheetContent = () => {
  // Dummy data
  const cart = {
    lines: [
      {
        id: '1',
        quantity: 2,
        cost: {
          totalAmount: {
            amount: '39.98',
            currencyCode: 'USD'
          }
        },
        merchandise: {
          title: 'Default Title',
          product: {
            title: 'Classic T-Shirt',
            handle: 'classic-t-shirt',
            featuredImage: {
              url: '/cup.webp',
              altText: 'Classic T-Shirt'
            }
          },
          selectedOptions: []
        }
      },
      {
        id: '21',
        quantity: 2,
        cost: {
          totalAmount: {
            amount: '39.98',
            currencyCode: 'USD'
          }
        },
        merchandise: {
          title: 'Default Title',
          product: {
            title: 'Classic T-Shirt',
            handle: 'classic-t-shirt',
            featuredImage: {
              url: '/bluemug.webp',
              altText: 'Classic T-Shirt'
            }
          },
          selectedOptions: []
        }
      },
  
      {
        id: '2',
        quantity: 1,
        cost: {
          totalAmount: {
            amount: '24.99',
            currencyCode: 'USD'
          }
        },
        merchandise: {
          title: 'Blue / Medium',
          product: {
            title: 'Premium Jeans',
            handle: 'premium-jeans',
            featuredImage: {
              url: '/mug.jpg',
              altText: 'Premium Jeans'
            }
          },
          selectedOptions: []
        }
      }
    ],
    cost: {
      totalTaxAmount: {
        amount: '5.99',
        currencyCode: 'USD'
      },
      totalAmount: {
        amount: '69.96',
        currencyCode: 'USD'
      }
    }
  };

  const DEFAULT_OPTION = 'Default Title';

  return (
    <div className="flex h-full flex-col">

      {!cart || cart.lines.length === 0 ? (
        <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
          <ShoppingCartIcon className="h-16" />
          <p className="mt-6 text-center text-2xl font-bold">Your cart is empty.</p>
        </div>
      ) : (
        <div className="flex h-full flex-col justify-between overflow-hidden p-1">
          <ul className="overflow-y-scrool  h-[300px]">
            {cart.lines
              .sort((a, b) =>
                a.merchandise.product.title.localeCompare(
                  b.merchandise.product.title
                )
              )
              .map((item, i) => (
                <li
                  key={i}
                  className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700"
                >
                  <div className="relative flex w-full flex-row justify-between px-1 py-4">
                    <div className="absolute z-40 -ml-1 -mt-2">
                      <button className="rounded-full bg-gray-100 p-1 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700">
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
                      <div className="relative h-16 w-16 overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                        <Image
                          className="h-full w-full "
                          width={64}
                          height={64}
                          objectFit='contain'
                          alt={
                            item.merchandise.product.featuredImage.altText ||
                            item.merchandise.product.title
                          }
                          src={item.merchandise.product.featuredImage.url}
                        />
                      </div>
                      <Link
                        href={`/product/${item.merchandise.product.handle}`}
                        className="z-30 ml-2 flex flex-row space-x-4"
                      >
                        <div className="flex flex-1 flex-col text-base">
                          <span className="leading-tight">
                            {item.merchandise.product.title}
                          </span>
                          {item.merchandise.title !== DEFAULT_OPTION ? (
                            <p className="text-sm text-neutral-500 dark:text-neutral-400">
                              {item.merchandise.title}
                            </p>
                          ) : null}
                        </div>
                      </Link>
                    </div>
                    <div className="flex h-16 flex-col justify-between">
                      <div className="flex justify-end space-y-2 text-right text-sm">
                        ${item.cost.totalAmount.amount}
                      </div>
                      <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                        <button className="px-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
                          -
                        </button>
                        <p className="w-6 text-center">
                          <span className="w-full text-sm">{item.quantity}</span>
                        </p>
                        <button className="px-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
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