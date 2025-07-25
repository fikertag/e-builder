"use client";

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
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { useUser } from "@/context/UserContext";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const { setUser } = useUser();

   const signIn = async () => {
    await authClient.signIn.social({
        provider: "google"
    })
}

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    try {

      const { error: loginError } = await authClient.signIn.email(
        {
          email,
          password,
          callbackURL: "/dashboard",
        },
        {
          onRequest: () => {
            setIsLoading(true);
          },
          onSuccess: (ctx) => {
            setSuccess("Login successful! Redirecting...");
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
            setIsLoading(false);
          },
          onError: (ctx) => {
            setError(ctx.error.message || "Login failed");
            setIsLoading(false);
          },
        }
      );
      if (loginError) {
        setError(loginError.message || "Login failed");
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
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin}>
            <div className="flex flex-col gap-6">
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
                  <Link
                    href="/auth/forgot-password"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" name="password" required />
              </div>
              {/* Feedback messages */}
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
                  {isLoading ? "Logging In..." : "Login"}
                </Button>
              </div>
            </div>
            
          </form>
          <div className="flex flex-col gap-3 mt-4">
            <Button
              variant="outline"
              className="w-full"
              disabled={isLoading}
              type="button"
              onClick={signIn}
            >
              Login with Google
            </Button>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link
                href="/auth/signup"
                className="underline underline-offset-4"
              >
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
