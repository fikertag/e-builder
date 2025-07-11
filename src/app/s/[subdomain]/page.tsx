"use client";
import LandingHero from "@/components/landingHero";
import ProductsSection from "@/components/productSection";
import Footer from "@/components/footer";
import { useQuery } from "@tanstack/react-query";
import { IProduct } from "@/types/index";
import { PackageCheck, Star, Truck } from "lucide-react";
import { useStoreData } from "@/store/useStoreData";
import { Badge } from "@/components/ui/badge";

export default function Page() {
  const store = useStoreData((state) => state.store);

  async function getProducts() {
    const res = await fetch(`/api/product?store=${store?.id}`);
    return res.json();
  }

  const {
    data: products,
    error,
    isLoading,
  } = useQuery<IProduct[]>({
    queryKey: ["products", store?.id],
    queryFn: () => getProducts(),
    enabled: !!store?.id,
  });
  return (
    <>
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow">
          <LandingHero
            title={store?.heroHeading || ""}
            description={store?.heroDescription || ""}
            imageUrl={store?.storeLandingImage || "/default-hero-image.jpg"}
          />
          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-gray-600">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-600">
                Error loading products: {error.message}
              </p>
            </div>
          ) : (
            <ProductsSection
              products={products || []}
              title="Featured Products"
              subtitle="Discover our most popular items"
            />
          )}

          <div className="flex gap-4 justify-center py-8">
            <div className="bg-primary text-primary-foreground p-6 rounded shadow">
              Primary Theme
            </div>
            <div className="bg-secondary text-secondary-foreground p-6 rounded shadow">
              Secondary Theme
            </div>
            <div className="bg-accent text-accent-foreground p-6 rounded shadow">
              Accent Theme
            </div>
            <div className="bg-muted text-muted-foreground p-6 rounded shadow">
              Muted Theme
            </div>
            <Badge
              className="mb-4 rounded-full px-4 py-1.5 text-sm font-medium shadow-sm transition-none"
              variant="secondary"
            >
              <span className="text-primary mr-1">✦</span> Visual Theme Editor
            </Badge>
          </div>

          <section className="py-16 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-14">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Why {store?.storeName || "Our Store"}?
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                  {store?.aboutUs || "Discover what makes us unique!"}
                </p>
              </div>

              <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
                {Array.isArray(store?.whyChooseUs) &&
                store.whyChooseUs.length > 0 ? (
                  store.whyChooseUs.map((reason, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
                        <div className="text-indigo-600 text-2xl font-bold">
                          {idx + 1}
                        </div>
                      </div>
                      <h3 className="font-semibold text-xl text-gray-800 mb-3 text-center">
                        {reason}
                      </h3>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                      <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
                        <Star className="w-8 h-8 text-indigo-600" />
                      </div>
                      <h3 className="font-semibold text-xl text-gray-800 mb-3">
                        Premium Quality
                      </h3>
                      <p className="text-gray-600">
                        Durable, high-quality products made with care and the
                        best materials.
                      </p>
                    </div>

                    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                      <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
                        <PackageCheck className="w-8 h-8 text-indigo-600" />
                      </div>
                      <h3 className="font-semibold text-xl text-gray-800 mb-3">
                        Unique Designs
                      </h3>
                      <p className="text-gray-600">
                        Custom artwork and creative options that express your
                        style—no generic products here.
                      </p>
                    </div>

                    <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                      <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
                        <Truck className="w-8 h-8 text-indigo-600" />
                      </div>
                      <h3 className="font-semibold text-xl text-gray-800 mb-3">
                        Fast Shipping
                      </h3>
                      <p className="text-gray-600">
                        Get your order delivered quickly with eco-friendly
                        packaging and care.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    </>
  );
}
