import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type LandingHeroProps = {
  title: string;
  description: string;
  imageUrl: string;
  imageAlt?: string;
  ctaText?: string;
  ctaHref?: string;
};

export default function LandingHero({
  title,
  description,
  imageUrl,
  imageAlt = "Hero image",
  ctaText = "Shop Now",
  ctaHref = "/products",
}: LandingHeroProps) {
  return (
    <div className="relative bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-10 flex flex-col items-center gap-8 lg:gap-12">
        {/* Content and image stacked vertically */}
        <div className="w-full max-w-3xl text-center space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-foreground leading-tight">
            {title.charAt(0).toUpperCase() + title.slice(1)}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            {description}
          </p>
          <div>
            <Link
              href={ctaHref}
              className="inline-flex items-center justify-center px-8 py-3 text-lg font-bold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105 gap-2"
            >
              {ctaText} <ArrowRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* Image container with reduced size and aspect ratio */}
        <div className="w-full max-w-2xl aspect-[16/7] relative rounded-xl overflow-hidden">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 800px"
          />
        </div>
      </div>
    </div>
  );
}