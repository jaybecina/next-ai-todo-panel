import { FileText, Bot, Zap } from "lucide-react";
import AuthClient from "@/components/auth/auth-client";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold text-gray-900">Todo Manager</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            AI-powered todo management system with real-time collaboration
          </p>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <Bot className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">AI Assistant</h3>
            <p className="text-gray-600">
              Natural language commands to create, manage, and track todos
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Smart Todos</h3>
            <p className="text-gray-600">
              Professional todo templates with automatic calculations
            </p>
          </div>

          <div className="text-center p-6 bg-white rounded-lg shadow-md">
            <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Real-time Sync</h3>
            <p className="text-gray-600">
              Instant updates across all devices with Supabase backend
            </p>
          </div>
        </div>

        {/* Auth Forms (Client Component) */}
        <AuthClient />

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p>Built with Next.js, TypeScript, Drizzle, Supabase, and AI</p>
        </div>
      </div>
    </div>
  );
}
