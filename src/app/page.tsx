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
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <Landing />
      <HowItWorks />
      <StoreShowcase />
      <section className="text-center py-10 px-4 font-semibold">
        <h2 className="text-6xl font-semibold mb-4">
          For <span className="text-[#5fde10]"> Everyone</span> From
          Intrepreneurs to <span className="text-[#5fde10]"> Enterprises</span>
        </h2>
        <p className=" max-w-2xl mx-auto text-xl">
          One platform to launch, manage, and grow your e-commerce store. No
          tech skills required. One platform to launch, manage, and grow your
          e-commerce store. No tech skills required.
        </p>
      </section>
      <div className="flex py-16 justify-center gap-10 items-center">
        <div>
          <Image
            alt="model"
            src={"/model.jpg"}
            height={350}
            width={350}
            objectFit="contain"
          />{" "}
        </div>
        <div>
          <h2 className="text-5xl font-semibold mb-4">
            How <span className="text-[#5fde10]">E-Comzy</span> Works ?
          </h2>
          <p className=" max-w-xl mx-auto text-xl">
            one platform to launch, manage, and grow your e-commerce store.
          </p>
        </div>
      </div>
      <WhyChoose />
      <PricingCTA />
      <Footer />
    </div>
  );
}
