// app/products/page.tsx
import ProductsSection from '@/components/productSection';
import { Product } from '@/types';

// This should come from your data source
const allProducts: Product[] = [
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
    {
    id: '7',
    name: 'Premium mug',
    description: 'Noise-cancelling headphones with premium sound quality',
    price: 29.99,
    imageUrl: '/cup.webp',
    category: 'mugs'
  },
  {
    id: '8',
    name: 'Classic White Mug',
    description: 'A timeless white mug perfect for your morning coffee or tea.',
    price: 14.99,
    imageUrl: '/mug.jpg',
    category: 'mugs'
  },
  {
    id: '9',
    name: 'Jogging Mug',
    description: 'Stay hydrated on the go with this stylish jogging mug.',
    price: 16.99,
    imageUrl: '/jog.avif',
    category: 'mugs'
  },
  {
    id: '10',
    name: 'Purple Ceramic Mug',
    description: 'Add a splash of color to your kitchen with this purple ceramic mug.',
    price: 15.99,
    imageUrl: '/purplemug.jpg',
    category: 'mugs'
  },
  {
    id: '11',
    name: 'Blue Mug',
    description: 'Enjoy your favorite drinks in this cool blue mug.',
    price: 15.99,
    imageUrl: '/bluemug.webp',
    category: 'mugs'
  },
  {
    id: '12',
    name: 'Black Travel Mug',
    description: 'A sleek black mug designed for travel and everyday use.',
    price: 18.99,
    imageUrl: '/blackmug.avif',
    category: 'mugs'
  },
    {
    id: '13',
    name: 'Premium mug',
    description: 'Noise-cancelling headphones with premium sound quality',
    price: 29.99,
    imageUrl: '/cup.webp',
    category: 'mugs'
  },
  {
    id: '14',
    name: 'Classic White Mug',
    description: 'A timeless white mug perfect for your morning coffee or tea.',
    price: 14.99,
    imageUrl: '/mug.jpg',
    category: 'mugs'
  },
  {
    id: '15',
    name: 'Jogging Mug',
    description: 'Stay hydrated on the go with this stylish jogging mug.',
    price: 16.99,
    imageUrl: '/jog.avif',
    category: 'mugs'
  },
  {
    id: '16',
    name: 'Purple Ceramic Mug',
    description: 'Add a splash of color to your kitchen with this purple ceramic mug.',
    price: 15.99,
    imageUrl: '/purplemug.jpg',
    category: 'mugs'
  },
  {
    id: '17',
    name: 'Blue Mug',
    description: 'Enjoy your favorite drinks in this cool blue mug.',
    price: 15.99,
    imageUrl: '/bluemug.webp',
    category: 'mugs'
  },
  {
    id: '18',
    name: 'Black Travel Mug',
    description: 'A sleek black mug designed for travel and everyday use.',
    price: 18.99,
    imageUrl: '/blackmug.avif',
    category: 'mugs'
  },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <ProductsSection 
          products={allProducts} 
          title="All Products" 
          subtitle="Browse our complete collection" 
        />
      </main>
    </div>
  );
}