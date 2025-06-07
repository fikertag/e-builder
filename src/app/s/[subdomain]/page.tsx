import LandingHero from '@/components/landingHero';
import ProductsSection from '@/components/productSection';
import Footer from '@/components/footer';
import {Header} from '@/components/navbar';
import { Product } from '@/types';

// Mock data - replace with real data source
const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'Premium Headphones',
    description: 'Noise-cancelling headphones with premium sound quality',
    price: 299.99,
    imageUrl: '/headphones.jpg',
    category: 'audio'
  },
  {
    id: '2',
    name: 'Smart Watch',
    description: 'Track your fitness and stay connected with this smart wearable',
    price: 199.99,
    imageUrl: '/smartwatch.jpg',
    category: 'wearables'
  },
  // Add 2-4 more products
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
        <LandingHero />
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