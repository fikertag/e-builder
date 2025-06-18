import { ArrowRightIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type LandingHeroProps = {
  title: string;
  description: string;
  imageUrl: string;
};

export default function LandingHero({
  title,
  description,
  imageUrl,
}: LandingHeroProps) {
  return (
    <div className="relative">
      <div className="container mx-auto px-10 py-10  flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {title.charAt(0).toUpperCase() + title.slice(1)}
          </h1>
          <p className="text-lg md:text-xl mb-8">{description}</p>
          <div className="flex justify-center md:justify-start">
            <Link
              href="/products"
              className="px-10 py-3 text-lg font-bold rounded-md bg-brand-accent text-white hover:bg-brand-accent-dark transition-colors transform hover:scale-105 flex justify-center items-center gap-2s "
            >
              Shop Now <ArrowRightIcon />
            </Link>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <div className="relative w-[300px] h-[200px] sm:w-[400px] sm:h-[300px] md:w-[500px] md:h-[400px] rounded-2xl shadow-xl bg-white/60">
            <Image
              src={imageUrl}
              alt="Hero"
              layout="fill"
              objectFit="contain"
              priority
              style={{ borderRadius: "1rem" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
