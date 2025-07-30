"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AIChat } from "@/components/ai/ai-chat";
import { DrizzleTest } from "@/components/test/drizzle-test";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InvoiceTutorial } from "@/components/tutorial/todo-ai-tutorial";
import { TodoAreaChart } from "@/components/dashboard/todo-area-chart";
import { supabase } from "@/lib/supabase/client";
import type { User as TUser } from "@supabase/supabase-js";
import { LogOut, User as UserIcon, FileText } from "lucide-react";
import { toast } from "sonner";

export function DashboardClient() {
  // Example todo chart data (replace with real data as needed)
  const todoChartData = [
    { date: "2025-07-01", completed: 5, pending: 3 },
    { date: "2025-07-02", completed: 7, pending: 2 },
    { date: "2025-07-03", completed: 6, pending: 4 },
    { date: "2025-07-04", completed: 8, pending: 1 },
    { date: "2025-07-05", completed: 10, pending: 0 },
    { date: "2025-07-06", completed: 9, pending: 2 },
    { date: "2025-07-07", completed: 11, pending: 1 },
  ];

  const [timeRange, setTimeRange] = useState("7d");
  const [user, setUser] = useState<TUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    checkUser();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser(session.user);
        router.push("/");
      } else {
        setUser(null);
        router.push("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      setUser(user);
    } else {
      setUser(null);
      router.push("/auth");
    }
    setLoading(false);
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Logged out successfully");
        router.push("/auth");
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
    <div className="h-[90vh] bg-background">
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="dashboard">
              <FileText className="h-4 w-4 mr-2" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="todos">
              <FileText className="h-4 w-4 mr-2" /> Todos
            </TabsTrigger>
          </TabsList>
          <TabsContent value="dashboard">
            <div className="max-w-4xl mx-auto">
              <TodoAreaChart
                data={todoChartData}
                timeRange={timeRange}
                setTimeRange={setTimeRange}
              />
            </div>
          </TabsContent>
          <TabsContent value="todos">
            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Todos</h2>
                <Button variant="outline" onClick={() => setTutorialOpen(true)}>
                  Todo AI Chat Tutorial
                </Button>
              </div>
              {/* TODO: Integrate TodoTable, TodoForm, TodoDialog here */}
              <div className="text-muted-foreground">
                Todo table coming soon...
              </div>
              <Dialog open={tutorialOpen} onOpenChange={setTutorialOpen}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Todo AI Chat Tutorial</DialogTitle>
                  </DialogHeader>
                  {/* Show only the Todo AI Tutorial step from InvoiceTutorial */}
                  <div>
                    <InvoiceTutorial />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
