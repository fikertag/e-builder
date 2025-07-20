import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function PricingCTA() {
  return (
    <section className="py-16 px-4 text-center">
      <h2 className="text-2xl sm:text-3xl font-semibold mb-4">
        Start Free. Upgrade Later.
      </h2>
      <p className="text-muted-foreground mb-6">
        Launch your store today — no credit card required.
      </p>
      <Button asChild className="bg-primary text-white font-bold py-3 px-6 rounded-md">
        <Link href={"/auth/signup"}>Start Free Trial</Link>
      </Button>
    </section>
  );
}
