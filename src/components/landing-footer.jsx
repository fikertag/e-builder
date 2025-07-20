import { SendHorizonal, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card-foreground text-foreground text-center py-10">
      <div className="flex flex-col md:flex-row items-center justify-between max-w-4xl mx-auto px-4 gap-6">
        {/* Social Media */}
        <div className="flex gap-4 justify-center mb-4 md:mb-0">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
          >
            <Twitter color="white" size={20} />{" "}
          </a>
          <a
            href="https://t.me/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
          >
            <SendHorizonal color="white" size={20} />
          </a>
          <a href="mailto:support@e-comzy.com" aria-label="Email">
            <Mail color="white" size={20} />
          </a>
        </div>
        {/* Support & Register */}
        <div className="flex gap-4 justify-center">
          <a
            href="https://t.me/"
            className="text-white flex gap-2 items-center"
          >
            Support <SendHorizonal size={15} />
          </a>
        </div>
      </div>
      <p className="mt-8 text-sm text-white">
        &copy; 2025 Ethify. All rights reserved.
      </p>
    </footer>
  );
}
