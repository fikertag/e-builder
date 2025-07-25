import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default function Landing() {
  return (
    <div className="flex flex-col items-center justify-center pb-16 pt-5">
      {/* Hero Section */}
      <div className="max-w-3xl text-center mt-16 mb-7 ">
        <h1 className="text-3xl min-[450px]:text-4xl sm:text-5xl md:text-6xl font-semibold mb-4 ">
          <span className="">
            <span className="text-primary">Start</span> Selling Online With
          </span>
          <br />
          Your Own <span className="text-primary">Website</span>
        </h1>
        <p className="text-gray-600 text-lg mb-8 max-w-2xl">
          Build your brand, reach more customers, and grow your business with a
          beautiful, easy-to-use online store.
        </p>
        <div className="flex flex-col min-[450px]:flex-row gap-4 justify-center mx-10 ">
          <Button asChild className="py-6 text-lg" size={"lg"}>
            <Link href={"/auth/signup"} className="text-white font-semibold ">
              Start free trial
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="text-lg py-6"
            size={"lg"}
          >
            <Link href={"/auth/login"}>Log in</Link>
          </Button>
        </div>
      </div>
      <Image
        alt="sample image website"
        src={"/landing.png"}
        height={350}
        width={350}
        objectFit="contain"
      />
    </div>
  );
}
