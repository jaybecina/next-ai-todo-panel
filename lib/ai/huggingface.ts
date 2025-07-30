import { InferenceClient } from "@huggingface/inference";

const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

export interface AIResponse {
  action: "create" | "read" | "list" | "unknown";
  entity: "todo" | "user" | "unknown";
  data?: unknown;
  message: string;
}

export class AIService {
  private static async generateResponse(prompt: string): Promise<string> {
    try {
      const response = await hf.textGeneration({
        model: "gpt2",
        inputs: prompt,
        parameters: {
          max_new_tokens: 200,
          temperature: 0.7,
          top_p: 0.9,
        },
      });

      return response.generated_text || "I understand your request.";
    } catch (error) {
      console.error("AI generation error:", error);
      return "I understand your request.";
    }
  }

  private static parseUserIntent(message: string): AIResponse {
    const lowerMessage = message.toLowerCase();
    // Create todo
    if (lowerMessage.includes("create") && lowerMessage.includes("todo")) {
      return {
        action: "create",
        entity: "todo",
        message:
          "I'll help you create a new todo. Please provide the title and description.",
      };
    }
    // List todos
    if (
      lowerMessage.includes("list") ||
      lowerMessage.includes("show") ||
      lowerMessage.includes("get")
    ) {
      if (lowerMessage.includes("todo")) {
        return {
          action: "list",
          entity: "todo",
          message: "I'll show you all your todos.",
        };
      }
    }
    // Block update and delete for todos
    if (
      (lowerMessage.includes("update") ||
        lowerMessage.includes("edit") ||
        lowerMessage.includes("modify")) &&
      lowerMessage.includes("todo")
    ) {
      return {
        action: "unknown",
        entity: "todo",
        message: "Sorry, editing todos via AI chat is not allowed.",
      };
    }
    if (
      (lowerMessage.includes("delete") || lowerMessage.includes("remove")) &&
      lowerMessage.includes("todo")
    ) {
      return {
        action: "unknown",
        entity: "todo",
        message: "Sorry, deleting todos via AI chat is not allowed.",
      };
    }
    // Get specific todo
    if (
      lowerMessage.includes("todo") &&
      (lowerMessage.includes("get") || lowerMessage.includes("show"))
    ) {
      return {
        action: "read",
        entity: "todo",
        message: "I'll show you the specific todo details.",
      };
    }
    // Default response
    return {
      action: "unknown",
      entity: "unknown",
      message:
        "I can help you manage todos. You can ask me to create or list todos.",
    };
  }

  static async processMessage(userMessage: string): Promise<AIResponse> {
    const intent = this.parseUserIntent(userMessage);

    // Generate a more natural response
    const aiResponse = await this.generateResponse(
      `User: ${userMessage}\nAssistant: ${intent.message}`
    );

    return {
      ...intent,
      message: aiResponse,
    };
  }
}
