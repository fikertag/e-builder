import CheckoutForm from "./CheckoutForm";

export default function CheckoutPage() {
  return (
    <div className="mx-auto">
      <CheckoutForm />
      <p className="text-center text-sm text-muted-foreground mt-2">
        By placing your order, you agree to our{" "}
        <a href="#" className="underline hover:text-primary">
          Terms
        </a>{" "}
        and{" "}
        <a href="#" className="underline hover:text-primary">
          Privacy Policy
        </a>
      </p>
    </div>
  );
}
