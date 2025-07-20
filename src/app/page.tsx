import { Header } from "@/components/header";
import Landing from "@/components/landing";
import HowItWorks from "@/components/howItWork";
import WhyChoose from "@/components/whyChoose";
import StoreShowcase from "@/components/StoreShowCase";
import PricingCTA from "@/components/pricing";
import Footer from "@/components/landing-footer";
import Image from "next/image";

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <Landing />
      <HowItWorks />
      <StoreShowcase />
      <section className="max-w-4xl mx-auto text-center py-16 px-4">
        <h2 className="text-3xl min-[450px]:text-4xl sm:text-5xl md:text-6xl font-semibold mb-4">
          For <span className="text-primary"> Everyone</span> From
          Intrepreneurs to <span className="text-primary"> Enterprises</span>
        </h2>
        <p className="max-w-2xl text-xl text-foreground">
          One platform to launch, manage, and grow your e-commerce store. No
          tech skills required. One platform to launch, manage, and grow your
          e-commerce store. No tech skills required.
        </p>
      </section>
      <section className="flex flex-col-reverse md:flex-row md:justify-center py-16 justify-around gap-10 items-center container mx-auto">
        <div className="h-70 w-70 bg-amber-200 relative">
          <Image
            alt="model"
            src={"/model.jpg"}
            fill
          />
        </div>
        <div >
          <h2 className="text-3xl min-[450px]:text-4xl sm:text-5xl md:text-5xl lg:text-6xl font-semibold mb-4 text-center">
            How <span className="text-primary">Ethify</span> Works?
          </h2>
          <p className="max-w-xl mx-5 text-xl text-foreground text-center">
            one platform to launch, manage, and grow your e-commerce store.
          </p>
        </div>
      </section>
      <WhyChoose />
      <PricingCTA />
      <Footer />
    </div>
  );
}
