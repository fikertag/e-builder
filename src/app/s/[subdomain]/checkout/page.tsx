'use client'; // Converts to Client Component for interactivity

import { LockIcon, ShieldCheckIcon } from 'lucide-react';
import { useState } from 'react';

export default function CheckoutPage() {
  // Dummy cart data
  const [cart, setCart] = useState({
    items: [
      {
        id: '1',
        title: 'Classic White T-Shirt',
        variant: 'White / Medium',
        price: 24.99,
        quantity: 2,
        image: '/mug.jpg'
      },
      {
        id: '2',
        title: 'Premium Black Jeans',
        variant: 'Black / 32',
        price: 59.99,
        quantity: 1,
        image: '/bluemug.webp'
      }
    ],
    subtotal: 109.97,
    shipping: 0,
    tax: 8.80,
    total: 118.77
  });

  // Form state
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    city: '',
    country: 'United States',
    postalCode: '',
    phone: '',
    shippingMethod: 'standard',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvc: ''
  });


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Order placed successfully (simulated)');
    if(1 < 0){
     setCart({
    items: [
      {
        id: '1',
        title: 'Classic White T-Shirt',
        variant: 'White / Medium',
        price: 24.99,
        quantity: 2,
        image: '/mug.jpg'
      },
      {
        id: '2',
        title: 'Premium Black Jeans',
        variant: 'Black / 32',
        price: 59.99,
        quantity: 1,
        image: '/bluemug.webp'
      }
    ],
    subtotal: 109.97,
    shipping: 0,
    tax: 8.80,
    total: 118.77
  })
  };
 }
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <div className="text-sm text-gray-500">
          Cart total: ${cart.total.toFixed(2)}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Customer Info */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Contact information</h2>
              <input
                type="email"
                name="email"
                placeholder="Email"
                className="w-full p-3 border rounded-md mb-4"
                required
                value={formData.email}
                onChange={handleChange}
              />
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Email me with news and offers</span>
              </label>
            </div>

            {/* Shipping Address */}
            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Shipping address</h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <input 
                  type="text" 
                  name="firstName"
                  placeholder="First name" 
                  className="p-3 border rounded-md" 
                  required 
                  value={formData.firstName}
                  onChange={handleChange}
                />
                <input 
                  type="text" 
                  name="lastName"
                  placeholder="Last name" 
                  className="p-3 border rounded-md" 
                  required 
                  value={formData.lastName}
                  onChange={handleChange}
                />
              </div>
              <input 
                type="text" 
                name="address"
                placeholder="Address" 
                className="w-full p-3 border rounded-md mb-4" 
                required 
                value={formData.address}
                onChange={handleChange}
              />
              <input 
                type="text" 
                name="apartment"
                placeholder="Apartment, suite, etc. (optional)" 
                className="w-full p-3 border rounded-md mb-4" 
                value={formData.apartment}
                onChange={handleChange}
              />
              <div className="grid grid-cols-3 gap-4 mb-4">
                <input 
                  type="text" 
                  name="city"
                  placeholder="City" 
                  className="p-3 border rounded-md" 
                  required 
                  value={formData.city}
                  onChange={handleChange}
                />
                <select 
                  name="country"
                  className="p-3 border rounded-md bg-white"
                  value={formData.country}
                  onChange={handleChange}
                >
                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                </select>
                <input 
                  type="text" 
                  name="postalCode"
                  placeholder="Postal code" 
                  className="p-3 border rounded-md" 
                  required 
                  value={formData.postalCode}
                  onChange={handleChange}
                />
              </div>
              <input 
                type="tel" 
                name="phone"
                placeholder="Phone" 
                className="w-full p-3 border rounded-md mb-4" 
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            {/* Shipping Method */}
            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Shipping method</h2>
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 border rounded-md cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <input 
                      type="radio" 
                      name="shippingMethod"
                      className="rounded-full" 
                      value="standard"
                      checked={formData.shippingMethod === 'standard'}
                      onChange={handleChange}
                    />
                    <div>
                      <p className="font-medium">Standard Shipping</p>
                      <p className="text-sm text-gray-500">4-5 business days</p>
                    </div>
                  </div>
                  <span className="font-medium">Free</span>
                </label>
                <label className="flex items-center justify-between p-4 border rounded-md cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center space-x-4">
                    <input 
                      type="radio" 
                      name="shippingMethod"
                      className="rounded-full" 
                      value="express"
                      checked={formData.shippingMethod === 'express'}
                      onChange={handleChange}
                    />
                    <div>
                      <p className="font-medium">Express Shipping</p>
                      <p className="text-sm text-gray-500">2-3 business days</p>
                    </div>
                  </div>
                  <span className="font-medium">$9.99</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="space-y-6">
            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Order summary</h2>
              
              {/* Cart Items */}
              <div className="divide-y">
                {cart.items.map((item) => (
                  <div key={item.id} className="py-4 flex justify-between">
                    <div className="flex space-x-4">
                      <div className="w-16 h-16  rounded-md overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-medium">{item.title}</p>
                        <p className="text-sm text-gray-500">{item.variant}</p>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Order Totals */}
              <div className="space-y-3 mt-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${cart.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>{cart.shipping === 0 ? 'Free' : `$${cart.shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>${cart.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t pt-3">
                  <span className="font-semibold">Total</span>
                  <div className="text-right">
                    <p className="font-semibold">${cart.total.toFixed(2)}</p>
                    <p className="text-sm text-gray-500">Includes ${cart.tax.toFixed(2)} tax</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="border rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Payment</h2>
              <div className="space-y-4">
                <div className="border rounded-md p-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      className="rounded-full" 
                      defaultChecked 
                    />
                    <span className="font-medium">Credit card</span>
                  </label>
                  <div className="mt-4 space-y-3">
                    <input 
                      type="text" 
                      name="cardNumber"
                      placeholder="Card number" 
                      className="w-full p-3 border rounded-md" 
                      value={formData.cardNumber}
                      onChange={handleChange}
                    />
                    <input 
                      type="text" 
                      name="cardName"
                      placeholder="Name on card" 
                      className="w-full p-3 border rounded-md" 
                      value={formData.cardName}
                      onChange={handleChange}
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input 
                        type="text" 
                        name="cardExpiry"
                        placeholder="Expiration date (MM/YY)" 
                        className="p-3 border rounded-md" 
                        value={formData.cardExpiry}
                        onChange={handleChange}
                      />
                      <input 
                        type="text" 
                        name="cardCvc"
                        placeholder="Security code" 
                        className="p-3 border rounded-md" 
                        value={formData.cardCvc}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="border rounded-md p-4">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input type="radio" name="paymentMethod" className="rounded-full" />
                    <span className="font-medium">PayPal</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center justify-center space-x-6 text-gray-500 text-sm">
              <div className="flex items-center space-x-2">
                <LockIcon className="w-4 h-4" />
                <span>Secure checkout</span>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheckIcon className="w-4 h-4" />
                <span>Guarantee</span>
              </div>
            </div>

            {/* Complete Order Button */}
            <button 
              type="submit"
              className="w-full bg-black text-white py-4 rounded-md font-medium hover:bg-gray-800 transition-colors"
             
            >
              Complete order
            </button>

            <p className="text-center text-sm text-gray-500">
              By placing your order, you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}