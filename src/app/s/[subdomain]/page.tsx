import LandingHero from '@/components/landingHero';
import ProductsSection from '@/components/productSection';
import Footer from '@/components/footer';
import {Header} from '@/components/navbar';
import { Product } from '@/types';

// Mock data - replace with real data source
const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'Premium mug',
    description: 'Noise-cancelling headphones with premium sound quality',
    price: 29.99,
    imageUrl: '/cup.webp',
    category: 'mugs'
  },
  {
    id: '2',
    name: 'Classic White Mug',
    description: 'A timeless white mug perfect for your morning coffee or tea.',
    price: 14.99,
    imageUrl: '/mug.jpg',
    category: 'mugs'
  },
  {
    id: '3',
    name: 'Jogging Mug',
    description: 'Stay hydrated on the go with this stylish jogging mug.',
    price: 16.99,
    imageUrl: '/jog.avif',
    category: 'mugs'
  },
  {
    id: '4',
    name: 'Purple Ceramic Mug',
    description: 'Add a splash of color to your kitchen with this purple ceramic mug.',
    price: 15.99,
    imageUrl: '/purplemug.jpg',
    category: 'mugs'
  },
  {
    id: '5',
    name: 'Blue Mug',
    description: 'Enjoy your favorite drinks in this cool blue mug.',
    price: 15.99,
    imageUrl: '/bluemug.webp',
    category: 'mugs'
  },
  {
    id: '6',
    name: 'Black Travel Mug',
    description: 'A sleek black mug designed for travel and everyday use.',
    price: 18.99,
    imageUrl: '/blackmug.avif',
    category: 'mugs'
  },
  // Add more products as needed
];

export default async function Page({
  params,
}: {
  params: Promise<{ subdomain: string }>
}) {
   const { subdomain } = await params

  return (
    <div className="min-h-screen flex flex-col">
      <Header title = {subdomain} />
      <main className="flex-grow">
         <LandingHero
      title="buy our latest cups and mugs"
      description="keep your drinks hot and your style cool with our exclusive collection of cups and mugs."
      imageUrl="/mug.jpg" 
    />
        <ProductsSection products={featuredProducts} />

        {/* Additional Sections */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-6">Why Choose Us</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature blocks */}
            </div>
          </div>
        </section>
        
        <section className="py-16 bg-indigo-50">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Subscribe to our newsletter for exclusive deals and updates
            </p>
            {/* Newsletter form */}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}