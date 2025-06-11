import {
  Facebook,
  Instagram,
  Twitter,
} from 'lucide-react';
import Link from 'next/link';
import { useStoreData } from "@/store/useStoreData";

export default function Footer() {
  const store = useStoreData((state) => state.store);
  // Social links from store.contact.social if available, else fallback
  const social = store?.contact?.social || {};
  const facebookUrl = social.facebook ? `https://facebook.com/${social.facebook}` : "https://facebook.com";
  const instagramUrl = social.instagram ? `https://instagram.com/${social.instagram}` : "https://instagram.com";
  const twitterUrl = social.twitter ? `https://twitter.com/${social.twitter}` : "https://twitter.com";
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-6 grid gap-8 md:grid-cols-3 text-center md:text-left">

        {/* Brand Info */}
        <div>
          <h2 className="text-2xl font-bold mb-2">{store?.storeName || "MugLife"}</h2>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} {store?.storeName || "MugLife"}. Sip in style.
          </p>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/products" className="hover:text-indigo-400">Products</Link></li>
            <li><Link href="/cart" className="hover:text-indigo-400">Cart</Link></li>
            <li><Link href="/signup" className="hover:text-indigo-400">Sign Up</Link></li>
            <li><Link href="/login" className="hover:text-indigo-400">Login</Link></li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Follow Us</h3>
          <div className="flex justify-center md:justify-start space-x-4">
            <a
              href={facebookUrl}
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-400 transition"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href={instagramUrl}
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-400 transition"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href={twitterUrl}
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-indigo-400 transition"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
