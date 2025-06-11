import Image from 'next/image';

type LandingHeroProps = {
  title: string;
  description: string;
  imageUrl: string;
};

export default function LandingHero({ title, description, imageUrl }: LandingHeroProps) {
  return (
    <div className="relative ">
      <div className="container mx-auto px-6 py-10 flex flex-col md:flex-row items-center">
        {/* Text Section */}
        <div className="w-full md:w-1/2 mb-10 md:mb-0 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {title.charAt(0).toUpperCase() + title.slice(1)}
          </h1>
          <p className="text-lg md:text-xl mb-8">{description}</p>
          <div className="flex justify-center md:justify-start">
            <a
              href="/products"
              className="bg-yellow-300 text-indigo-600 px-8 py-3 rounded-full font-bold hover:bg-gray-100 transition"
            >
              Shop Now
            </a>
          </div>
        </div>

        {/* Image Section */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end">
          <div className="relative w-[300px] h-[200px] sm:w-[400px] sm:h-[300px] md:w-[500px] md:h-[400px]">
            <Image
              src={imageUrl}
              alt="Hero"
              layout="fill"
              objectFit="contain"
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
