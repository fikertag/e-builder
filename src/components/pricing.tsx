import { Button } from "@/components/ui/button";

export default function PricingCTA() {
  return (
    <section className="py-16 px-4 text-center">
      <h2 className="text-3xl font-semibold mb-4">
        Start Free. Upgrade Later.
      </h2>
      <p className="text-muted-foreground mb-6">
        Launch your store today — no credit card required.
      </p>
      <Button className="bg-primary text-white font-bold py-3 px-6 rounded-md">
        Start Free Trial
      </Button>
    </section>
  );
}
