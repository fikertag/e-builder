import CheckoutForm from "./CheckoutForm";

export default function CheckoutPage() {
  return (
    <div className=" mx-auto">
      <CheckoutForm />
      <p className="text-center text-sm text-gray-500 mt-2">
        By placing your order, you agree to our{" "}
        <a href="#" className="underline">
          Terms
        </a>{" "}
        and{" "}
        <a href="#" className="underline">
          Privacy Policy
        </a>
      </p>
    </div>
  );
}
