import Link from "next/link";
import { Facebook, X, Instagram, SendHorizonal } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-black text-white text-center py-10">
      <div className="flex flex-col md:flex-row items-center justify-between max-w-4xl mx-auto px-4 gap-6">
        {/* Social Media */}
        <div className="flex gap-4 justify-center mb-4 md:mb-0">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <X />{" "}
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
          >
            <Facebook />
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <Instagram />{" "}
          </a>
          <a
            href="https://t.me/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
          >
            <SendHorizonal />
          </a>
          <a href="mailto:support@e-comzy.com" aria-label="Email">
            <SendHorizonal />{" "}
          </a>
        </div>
        {/* Support & Register */}
        <div className="flex gap-4 justify-center">
          <Link
            href="/support"
            className="bg-white text-black px-4 py-2 rounded-md font-semibold hover:bg-[#5fde10] hover:text-white transition"
          >
            Support
          </Link>
          <Link
            href="/auth/sign-in"
            className="bg-[#5fde10] text-white px-4 py-2 rounded-md font-semibold hover:bg-white hover:text-[#5fde10] border border-[#5fde10] transition"
          >
            Register
          </Link>
        </div>
      </div>
      <p className="mt-8 text-sm text-gray-400">
        &copy; {new Date().getFullYear()} E-Comzy. All rights reserved.
      </p>
    </footer>
  );
}
