"use client";
import LandingHero from "@/components/landingHero";
import ProductsSection from "@/components/productSection";
import Footer from "@/components/footer";
import { useQuery } from "@tanstack/react-query";
import { IProduct } from "@/types/index";
import { useStoreData } from "@/store/useStoreData";

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
              <p className="text-muted-foreground">Loading products...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-destructive">
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
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-14">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                  Why {store?.storeName || "Our Store"}?
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                  {store?.aboutUs || "Discover what makes us unique!"}
                </p>
              </div>

              <div className="grid gap-8 grid-cols-1 md:grid-cols-3">
                {store?.whyChooseUs.map((reason, idx) => (
                    <div
                      key={idx}
                      className="bg-card p-8 rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                    >
                      <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
                        <div className="text-primary text-2xl font-bold">
                          {idx + 1}
                        </div>
                      </div>
                      <h3 className="font-semibold text-xl text-card-foreground mb-3 text-center">
                        {reason}
                      </h3>
                    </div>
                  ))}
              </div>
            </div>
          </section>

          {/* About Us Section */}
          <section className="py-16 bg-card/10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">About Us</h2>
                <p className="text-muted-foreground text-lg mb-6">
                  {store?.aboutUs || "Learn more about our story, mission, and values."}
                </p>
                {store?.contact?.address && (
                  <div className="text-sm text-muted-foreground mb-2">
                    <span className="font-semibold">Address:</span> {store.contact.address}
                  </div>
                )}
                {store?.contact?.email && (
                  <div className="text-sm text-muted-foreground mb-2">
                    <span className="font-semibold">Email:</span> {store.contact.email}
                  </div>
                )}
                {store?.contact?.phone && (
                  <div className="text-sm text-muted-foreground mb-2">
                    <span className="font-semibold">Phone:</span> {store.contact.phone}
                  </div>
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
