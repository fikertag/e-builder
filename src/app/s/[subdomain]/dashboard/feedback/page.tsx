"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function FeedbackPage() {
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate feedback submission (replace with real API if needed)
    setTimeout(() => {
      setSubmitted(true);
      setLoading(false);
      setFeedback("");
    }, 1000);
  };

  return (
    <Card className="max-w-xl mx-auto mt-8">
      <CardHeader>
        <CardTitle>Feedback</CardTitle>
      </CardHeader>
      <CardContent>
        {submitted ? (
          <div className="text-green-600 py-4">
            Thank you for your feedback!
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Let us know what you think, or report an issue..."
              rows={5}
              required
            />
            <Button type="submit" disabled={loading || !feedback.trim()}>
              {loading ? "Submitting..." : "Submit Feedback"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
