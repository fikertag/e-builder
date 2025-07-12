"use client";

import { authClient } from "@/lib/auth-client";

const Home = () => {
  // Ensure the user is authenticated
  const { data } = authClient.useSession();

  console.log("User session data:", data?.user);

  if (!data?.user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-foreground">
          Please log in to access your account
        </h1>
        <p className="text-lg text-muted-foreground">
          You need to be logged in to view this page.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-4 text-foreground">
        Welcome to the Account Page
      </h1>
      <p className="text-lg text-muted-foreground">
        This is a placeholder for your account management features.
      </p>
    </div>
  );
};
export default Home;
