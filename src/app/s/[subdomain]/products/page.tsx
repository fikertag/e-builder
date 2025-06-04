// app/products/page.tsx
import ProductsSection from '@/components/productSection';
import { Product } from '@/types';

// This should come from your data source
const allProducts: Product[] = [
  // Your full product list
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow py-12">
        <ProductsSection 
          products={allProducts} 
          title="All Products" 
          subtitle="Browse our complete collection" 
        />
      </main>
      {/* Footer */}
    </div>
  );
}