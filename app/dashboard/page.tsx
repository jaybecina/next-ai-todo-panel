"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AIChat } from "@/components/ai/ai-chat";
import { InvoiceList } from "@/components/invoices/invoice-list";
import { InvoiceTutorial } from "@/components/tutorial/invoice-tutorial";
import { DrizzleTest } from "@/components/test/drizzle-test";
import { supabase } from "@/lib/supabase/client";
import type { User as TUser } from "@supabase/supabase-js";
import {
  LogOut,
  User as UserIcon,
  FileText,
  Bot,
  BookOpen,
  Database,
} from "lucide-react";
import { toast } from "sonner";

export default function Dashboard() {
  const [user, setUser] = useState<TUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "invoices" | "ai" | "tutorial" | "test"
  >("invoices");
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      setLoading(true);
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.push("/");
        return;
      }

      setUser(user);
    } catch (error) {
      console.error("Error checking user:", error);
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Logged out successfully");
        router.push("/");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to home page
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            <span className="font-semibold">Welcome, {user.email}</span>
          </div>
          <Button onClick={handleLogout} variant="outline" size="sm">
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Tab Navigation */}
        <div className="flex gap-2 mb-8">
          <Button
            variant={activeTab === "invoices" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("invoices")}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Invoices
          </Button>
          <Button
            variant={activeTab === "ai" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("ai")}
            className="flex items-center gap-2"
          >
            <Bot className="h-4 w-4" />
            AI Assistant
          </Button>
          <Button
            variant={activeTab === "tutorial" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("tutorial")}
            className="flex items-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Tutorial
          </Button>
          <Button
            variant={activeTab === "test" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("test")}
            className="flex items-center gap-2"
          >
            <Database className="h-4 w-4" />
            Test DB
          </Button>
        </div>

        {/* Tab Content */}
        {activeTab === "invoices" ? (
          <InvoiceList />
        ) : activeTab === "ai" ? (
          <div className="max-w-4xl mx-auto">
            <AIChat />
          </div>
        ) : activeTab === "tutorial" ? (
          <div className="max-w-4xl mx-auto">
            <InvoiceTutorial />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <DrizzleTest />
          </div>
        )}
      </main>
    </div>
  );
}
