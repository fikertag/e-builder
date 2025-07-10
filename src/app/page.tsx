import { Header } from "@/components/header";
import Landing from "@/components/landing";
import HowItWorks from "@/components/howItWork";
import WhyChoose from "@/components/whyChoose";
import StoreShowcase from "@/components/StoreShowCase";
import PricingCTA from "@/components/pricing";
import Footer from "@/components/landing-footer";

export default async function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />
      <Landing />
      <HowItWorks />
      <WhyChoose />
      <StoreShowcase />
      <PricingCTA />
      <Footer />
    </div>
  );
}
