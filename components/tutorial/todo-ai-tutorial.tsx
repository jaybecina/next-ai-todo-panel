"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Plus,
  Edit,
  Trash2,
  Bot,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Users,
  Calendar,
  DollarSign,
} from "lucide-react";

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  manualSteps: string[];
  aiCommands: string[];
  icon: React.ReactNode;
}

const tutorialSteps: TutorialStep[] = [
  {
    id: 6,
    title: "Todo AI Tutorial",
    description:
      "Learn how to manage your todos manually or using AI chat commands.",
    manualSteps: [
      'Go to the "Todos" tab in the dashboard.',
      'Click the "Create a todo" button above the table.',
      "Fill in the todo details (title, description, due date).",
      'Click "Create Todo" to add it to your list.',
      "Use the actions column to edit, delete, or view todo details in a dialog.",
    ],
    aiCommands: [
      '"Create a todo: Shopping description: buy pants, sweater and underwears"',
      '"List all my todos"',
      '"Show my pending todos"',
      '"Read todo: Shopping"',
      '"Delete todo: Shopping"',
    ],
    icon: <Bot className="h-5 w-5" />,
  },
  {
    id: 1,
    title: "Create Invoice",
    description:
      "Learn how to create new invoices manually or using AI commands",
    manualSteps: [
      'Click the "New Invoice" button in the Invoices tab',
      "Fill in the invoice details (number, client, dates)",
      "Add invoice items with descriptions, quantities, and prices",
      'Review the total and click "Create Invoice"',
    ],
    aiCommands: [
      '"Create an invoice for John Doe for web development services"',
      '"Make an invoice INV-2024-001 for Jane Smith with 2 items: consulting $500 and design $300"',
      '"Create invoice for ABC Company due next month"',
    ],
    icon: <Plus className="h-5 w-5" />,
  },
  {
    id: 2,
    title: "Edit Invoice",
    description: "Update existing invoice information manually or via AI",
    manualSteps: [
      'Find the invoice in the list and click "Actions"',
      'Select "Edit" from the dropdown menu',
      "Modify the invoice details in the form",
      'Click "Update Invoice" to save changes',
    ],
    aiCommands: [
      '"Update invoice INV-2024-001 to change the client to Jane Smith"',
      '"Edit invoice INV-2024-001 and add a new item: maintenance $200"',
      '"Change the due date of invoice INV-2024-001 to next Friday"',
    ],
    icon: <Edit className="h-5 w-5" />,
  },
  {
    id: 3,
    title: "Delete Invoice",
    description: "Remove invoices from the system manually or with AI",
    manualSteps: [
      'Find the invoice in the list and click "Actions"',
      'Select "Delete" from the dropdown menu',
      "Confirm the deletion in the popup dialog",
      "The invoice will be permanently removed",
    ],
    aiCommands: [
      '"Delete invoice INV-2024-001"',
      '"Remove the invoice for John Doe"',
      '"Cancel invoice INV-2024-002"',
    ],
    icon: <Trash2 className="h-5 w-5" />,
  },
  {
    id: 4,
    title: "View & List Invoices",
    description: "Browse and search through your invoices",
    manualSteps: [
      'Switch to the "Invoices" tab to see all invoices',
      'Use the "Refresh" button to update the list',
      "Invoices are displayed with status, client, and total",
      'Click "Actions" to edit or delete specific invoices',
    ],
    aiCommands: [
      '"Show me all invoices"',
      '"List overdue invoices"',
      '"Show invoices for John Doe"',
      '"Display paid invoices"',
    ],
    icon: <FileText className="h-5 w-5" />,
  },
  {
    id: 5,
    title: "AI Assistant",
    description: "Use natural language to manage invoices with AI",
    manualSteps: [
      'Switch to the "AI Assistant" tab',
      "Type your request in natural language",
      "The AI will understand and execute your command",
      "View the results and confirmation messages",
    ],
    aiCommands: [
      '"Create an invoice for John Doe for web development services"',
      '"Mark invoice INV-2024-001 as paid"',
      '"Show me all overdue invoices"',
      '"Update the client name for invoice INV-2024-002"',
    ],
    icon: <Bot className="h-5 w-5" />,
  },
];

export function InvoiceTutorial() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2">Invoice Management Tutorial</h2>
        <p className="text-muted-foreground">
          Learn how to manage invoices both manually and using AI commands
        </p>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center">
        <div className="flex space-x-2">
          {tutorialSteps.map((step, index) => (
            <button
              key={step.id}
              onClick={() => setActiveStep(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === activeStep
                  ? "bg-primary"
                  : "bg-muted hover:bg-muted-foreground"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Current Step */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {tutorialSteps[activeStep].icon}
            {tutorialSteps[activeStep].title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-muted-foreground">
            {tutorialSteps[activeStep].description}
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Manual Method */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                <h3 className="font-semibold">Manual Method</h3>
              </div>
              <div className="space-y-2">
                {tutorialSteps[activeStep].manualSteps.map((step, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <Badge variant="secondary" className="mt-0.5">
                      {index + 1}
                    </Badge>
                    <p className="text-sm">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Method */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                <h3 className="font-semibold">AI Commands</h3>
              </div>
              <div className="space-y-2">
                {tutorialSteps[activeStep].aiCommands.map((command, index) => (
                  <div key={index} className="bg-muted p-3 rounded-lg">
                    <p className="text-sm font-mono">{command}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Button
              variant="outline"
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
            >
              Previous
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {activeStep + 1} of {tutorialSteps.length}
              </span>
            </div>

            <Button
              onClick={() =>
                setActiveStep(
                  Math.min(tutorialSteps.length - 1, activeStep + 1)
                )
              }
              disabled={activeStep === tutorialSteps.length - 1}
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            Quick Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <h4 className="font-semibold">Manual Management</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Use the form for detailed invoice creation</li>
                <li>• Add multiple items with automatic total calculation</li>
                <li>• Set status and due dates for better organization</li>
                <li>• Edit existing invoices with full form control</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">AI Commands</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Use natural language for quick operations</li>
                <li>• AI understands context and invoice numbers</li>
                <li>• Perfect for bulk operations and quick edits</li>
                <li>• Get instant feedback and confirmations</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
