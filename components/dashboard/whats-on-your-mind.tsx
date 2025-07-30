"use client";

import { useState } from "react";
import { AIService } from "@/lib/ai/huggingface";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// No starterReplies or getRandomReply needed

export function WhatsOnYourMind() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "assistant", text: "What's on your mind today?" },
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setLoading(true);
    try {
      const aiResponse = await AIService.processMessage(input);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: aiResponse.message },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", text: "Sorry, I couldn't reply right now." },
      ]);
    }
    setInput("");
    setLoading(false);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>What&apos;s on your mind?</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={
                  msg.role === "user"
                    ? "text-right text-primary"
                    : "text-left text-muted-foreground"
                }
              >
                {msg.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2 mt-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Share your thoughts..."
              onKeyDown={async (e) => {
                if (e.key === "Enter" && !loading) await handleSend();
              }}
              disabled={loading}
            />
            <Button onClick={handleSend} variant="default" disabled={loading}>
              {loading ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
