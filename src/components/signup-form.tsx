"use client";
import { authClient } from "@/lib/customer-auth-client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useStoreData } from "@/store/useStoreData";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { store } = useStoreData();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const router = useRouter();
  const { setUser } = useUser();

  const handleSignup = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    try {
      const falseEmail = store?.id + email;
      const { error: signupError } = await authClient.signUp.email(
        {
          email: falseEmail,
          realEmail: email,
          password,
          name,
          storeId: store?.id || "",
        },
        {
          onRequest: () => {
            setIsLoading(true);
          },
          onSuccess: (ctx) => {
            setSuccess("Signup successful! Redirecting...");
            // Save user in context
            if (ctx?.data?.user) {
              setUser({
                id: ctx.data.user.id,
                name: ctx.data.user.name,
                email: ctx.data.user.email,
                emailVerified: ctx.data.user.emailVerified,
                image: ctx.data.user.image ?? null,
                role: ctx.data.user.role ?? null,
                roles: ctx.data.user.roles ?? null,
              });
            }
            router.replace("/orders");
            setIsLoading(false);
          },
          onError: (ctx) => {
            setError(ctx.error.message || "Signup failed");
            setIsLoading(false);
          },
        }
      );
      if (signupError) {
        setError(signupError.message || "Signup failed");
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Signup failed");
      } else {
        setError("Signup failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>
            Enter your email below to create a new account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  name="name"
                  required
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  name="email"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input id="password" type="password" name="password" required />
              </div>
              {error && (
                <div className="text-center text-sm text-destructive">
                  {error}
                </div>
              )}
              {success && (
                <div className="text-center text-sm text-green-600">
                  {success}
                </div>
              )}
              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing Up..." : "Sign Up"}
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/auth/login" className="underline underline-offset-4">
                Sign up
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
