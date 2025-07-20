"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!newPassword || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    const token = new URLSearchParams(window.location.search).get("token");
    if (!token) {
      setError("Invalid or missing token.");
      setLoading(false);
      return;
    }
    try {
      const { error: resetError } = await authClient.resetPassword({
        newPassword,
        token,
      });
      if (resetError) {
        setError(resetError.message || "Failed to reset password.");
      } else {
        setSuccess("Password reset successful! Redirecting to login...");
        setTimeout(() => router.push("/auth/login"), 2000);
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>
            Enter your new password below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-3">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                name="newPassword"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            {error && (
              <div className="text-red-500 text-center text-sm mb-2">{error}</div>
            )}
            {success && (
              <div className="text-green-600 text-center text-sm mb-2">{success}</div>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
