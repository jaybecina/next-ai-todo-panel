'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Send, Bot, User } from 'lucide-react';
import { toast } from 'sonner';

interface ChatMessage {
  id: string;
  message: string;
  response: string;
  timestamp: Date;
  isUser: boolean;
}

export function AIChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      message: userMessage,
      response: '',
      timestamp: new Date(),
      isUser: true,
    };

    setMessages(prev => [...prev, userMsg]);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      
      // Update the last message with AI response
      setMessages(prev => prev.map(msg => 
        msg.id === userMsg.id 
          ? { ...msg, response: data.message }
          : msg
      ));

    } catch (error) {
      console.error('AI chat error:', error);
      toast.error('Failed to get AI response');
      
      // Update the last message with error
      setMessages(prev => prev.map(msg => 
        msg.id === userMsg.id 
          ? { ...msg, response: 'Sorry, I encountered an error. Please try again.' }
          : msg
      ));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full h-[600px] flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          AI Invoice Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              <Bot className="h-8 w-8 mx-auto mb-2" />
              <p className="font-semibold mb-4">AI Invoice Assistant</p>
              <p className="text-sm mb-4">I can help you manage your invoices with natural language commands!</p>
              <div className="text-left space-y-2 text-xs">
                <p><strong>Create Invoice:</strong> "Create an invoice for John Doe for web development services"</p>
                <p><strong>Edit Invoice:</strong> "Update invoice INV-2024-001 to change the client to Jane Smith"</p>
                <p><strong>Delete Invoice:</strong> "Delete invoice INV-2024-001"</p>
                <p><strong>List Invoices:</strong> "Show me all invoices" or "List overdue invoices"</p>
                <p><strong>Mark as Paid:</strong> "Mark invoice INV-2024-001 as paid"</p>
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <div key={message.id} className="space-y-2">
              {/* User Message */}
              <div className="flex items-start gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="flex-1">
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-sm">{message.message}</p>
                  </div>
                </div>
              </div>
              
              {/* AI Response */}
              {message.response && (
                <div className="flex items-start gap-2">
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="bg-primary/10 rounded-lg p-3">
                      <p className="text-sm">{message.response}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {loading && (
            <div className="flex items-start gap-2">
              <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                <Bot className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <div className="bg-primary/10 rounded-lg p-3">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
        
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me to help with invoices..."
            disabled={loading}
            className="flex-1"
          />
          <Button type="submit" disabled={loading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 