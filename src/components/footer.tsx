import { Facebook, Instagram, Twitter } from "lucide-react";
import Link from "next/link";
import { useStoreData } from "@/store/useStoreData";

export default function Footer() {
  const store = useStoreData((state) => state.store);
  const social = store?.contact?.social || {};

  const socialLinks = [
    {
      icon: Facebook,
      url: social.facebook ? `https://facebook.com/${social.facebook}` : "",
      label: "Facebook",
    },
    {
      icon: Instagram,
      url: social.instagram ? `https://instagram.com/${social.instagram}` : "",
      label: "Instagram",
    },
    {
      icon: Twitter,
      url: social.twitter ? `https://twitter.com/${social.twitter}` : "",
      label: "Twitter",
    },
  ];

  const hasSocialLinks = socialLinks.some((link) => !!link.url);
  return (
    <footer className="bg-secondary text-secondary-foreground py-12">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand Info */}
        <div className="flex flex-col items-center md:items-start space-y-4">
          <h2 className="text-2xl font-bold tracking-tight">
            {store?.storeName}
          </h2>
          <p className="text-muted-foreground ">
            {store?.description || "Quality products for your everyday life"}
          </p>
          <p className="text-sm text-muted-foreground/70 text-center">
            © {new Date().getFullYear()} {store?.storeName}. All rights
            reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col items-center space-y-4">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <div className="flex flex-col space-y-2">
            <Link
              href="/products"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              All Products
            </Link>
          </div>
        </div>

        {/* Social Media */}
        {hasSocialLinks && (
          <div className="flex flex-col items-center md:items-end space-y-4">
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) =>
                social.url ? (
                  <Link
                    key={index}
                    href={social.url}
                    aria-label={social.label}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-muted p-2 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                  >
                    <social.icon className="w-5 h-5" />
                  </Link>
                ) : null
              )}
            </div>

            {store?.contact?.email && (
              <Link
                href={`mailto:${store.contact.email}`}
                className="text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                {store.contact.email}
              </Link>
            )}
          </div>
        )}
      </div>
    </footer>
  );
}
