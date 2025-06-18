import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";
import { useStoreData } from "@/store/useStoreData";

export default function Footer() {
  const store = useStoreData((state) => state.store);
  const social = store?.contact?.social || {};

  const socialLinks = [
    {
      icon: Facebook,
      url: social.facebook
        ? `https://facebook.com/${social.facebook}`
        : "https://facebook.com",
      label: "Facebook",
    },
    {
      icon: Instagram,
      url: social.instagram
        ? `https://instagram.com/${social.instagram}`
        : "https://instagram.com",
      label: "Instagram",
    },
    {
      icon: Twitter,
      url: social.twitter
        ? `https://twitter.com/${social.twitter}`
        : "https://twitter.com",
      label: "Twitter",
    },
  ];

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand Info */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">
            {store?.storeName || "MugLife"}
          </h2>
          <p className="text-gray-400 max-w-xs">
            {store?.description || "Quality products for your everyday life"}
          </p>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} {store?.storeName || "MugLife"}. All
            rights reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <div className="flex flex-col space-y-2">
            <Link
              href="/products"
              className="text-gray-400 hover:text-indigo-400 transition-colors"
            >
              All Products
            </Link>
          </div>
        </div>

        {/* Social Media */}
        <div className="flex flex-col items-center md:items-end space-y-4">
          <h3 className="text-lg font-semibold">Follow Us</h3>
          <div className="flex space-x-4">
            {socialLinks.map((social, index) => (
              <a
                key={index}
                href={social.url}
                aria-label={social.label}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gray-800 p-2 rounded-full hover:bg-indigo-600 transition-colors"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>

          {store?.contact?.email && (
            <a
              href={`mailto:${store.contact.email}`}
              className="text-gray-400 hover:text-indigo-400 transition-colors text-sm"
            >
              {store.contact.email}
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
