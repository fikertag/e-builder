"use client";

import { authClient } from "@/lib/auth-client";
import { SignupForm } from "@/components/signup-form";
import Link from "next/link";

const Home = () => {
  const { data, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <div className="flex w-full items-center justify-center min-h-screen">
        <p className="text-muted-foreground text-lg">Loading...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div
        style={{ minHeight: "calc(100svh - 70px)" }}
        className="flex w-full items-center justify-center "
      >
        <div className="w-full max-w-sm p-6 md:p-10 bg-card rounded-lg shadow">
          <SignupForm />
        </div>
      </div>
    );
  }

  return (
    <div
      style={{ minHeight: "calc(100svh - 70px)" }}
      className=" flex flex-col items-center justify-center px-4"
    >
      <h1 className="text-4xl font-bold mb-6 text-foreground text-center">
        Welcome, {data.user?.name ?? "User"}
      </h1>
      <div className="bg-card p-8 rounded-xl shadow-md w-full max-w-md mb-8">
        <div className="space-y-4">
          <div>
            <span className="font-semibold text-foreground">Name:</span>
            <span className="ml-2 text-muted-foreground">
              {data.user?.name ?? "N/A"}
            </span>
          </div>
          <div>
            <span className="font-semibold text-foreground">Email:</span>
            <span className="ml-2 text-muted-foreground">
              {data.user?.email ?? "N/A"}
            </span>
          </div>
          <div>
            <span className="font-semibold text-foreground">Phone Number:</span>
            <span className="ml-2 text-muted-foreground">
              {data.user?.name ?? "N/A"}
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 mt-8">
          <Link
            href="/orders"
            className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition text-center font-medium"
          >
            Go to Order Page
          </Link>
          <button
            onClick={() => authClient.signOut()}
            className="flex-1 px-4 py-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90 transition text-center font-medium"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
