"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [timer, setTimer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (submitted && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [submitted, timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { data, error } = await authClient.forgetPassword({
        email,
        redirectTo: "/auth/reset-password",
      });
      setSubmitted(true);
      setTimer(30);
      console.log(data, error);
      if (error) {
        setError(error.message || "Failed to send reset link.");
      } else if (data) {
        setSuccess("Email sent successfully! Please check your inbox.");
      }
    } catch (err) {
      setError(err ? "Failed to send reset link." : "Failed to send reset link." );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email address and we&apos;ll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                name="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="text-red-600 text-center text-sm mb-2">{error}</div>
            )}
            {success && (
              <div className="text-green-600 text-center text-sm mb-2">{success}</div>
            )}
            <Button type="submit" className="w-full" disabled={loading || (submitted && timer > 0)}>
              {loading
                ? "Sending Reset Link..."
                : submitted && timer > 0
                ? `Resend in ${timer}s`
                : "Send Reset Link"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}