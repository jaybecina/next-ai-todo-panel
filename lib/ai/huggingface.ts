import { InferenceClient } from "@huggingface/inference";

const hf = new InferenceClient(process.env.HUGGINGFACE_API_KEY);

export interface AIResponse {
  action: "create" | "read" | "list" | "unknown";
  entity: "todo" | "user" | "unknown";
  data?: unknown;
  message: string;
}

export class AIService {
  private static async generateResponse(
    prompt: string,
    model: string = "gpt2"
  ): Promise<string> {
    try {
      const response = await hf.textGeneration({
        model,
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

  private static parseUserIntentTodo(
    message: string,
    restrict: boolean = false
  ): AIResponse {
    if (restrict) {
      // If not called from a todo component, always return unknown intent
      return {
        action: "unknown",
        entity: "unknown",
        message: "Todo actions are only available in the todo component.",
      };
    }
    const lowerMessage = message.toLowerCase();
    // Remove punctuation for easier matching
    const cleanMessage = lowerMessage.replace(/[.,:;!?]/g, "");

    // Create todo (match variations)
    if (
      /\b(create|add|new|make)\b.*\b(todo|task|reminder)\b/.test(cleanMessage)
    ) {
      return {
        action: "create",
        entity: "todo",
        message:
          "I'll help you create a new todo. Please provide the title and description.",
      };
    }
    // List todos (match variations)
    if (
      /\b(list|show|get|see|display|all)\b.*\b(todo|task|reminder)s?\b/.test(
        cleanMessage
      )
    ) {
      return {
        action: "list",
        entity: "todo",
        message: "I'll show you all your todos.",
      };
    }
    // Block update and delete for todos
    if (
      /\b(update|edit|modify|change)\b.*\b(todo|task|reminder)\b/.test(
        cleanMessage
      )
    ) {
      return {
        action: "unknown",
        entity: "todo",
        message: "Sorry, editing todos via AI chat is not allowed.",
      };
    }
    if (
      /\b(delete|remove|erase|discard)\b.*\b(todo|task|reminder)\b/.test(
        cleanMessage
      )
    ) {
      return {
        action: "unknown",
        entity: "todo",
        message: "Sorry, deleting todos via AI chat is not allowed.",
      };
    }
    // Get specific todo
    if (
      /\b(todo|task|reminder)\b.*\b(get|show|see|display)\b/.test(cleanMessage)
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

  private static parseUserIntentWhatsOnYourMind(message: string): AIResponse {
    // For general chat, always reply as 'unknown' action/entity, and encourage conversation
    return {
      action: "unknown",
      entity: "unknown",
      message: "Let's chat! Feel free to share anything on your mind.",
    };
  }

  static async processMessage(
    userMessage: string,
    mode: "todo" | "chat" = "chat"
  ): Promise<AIResponse> {
    const intent =
      mode === "todo"
        ? this.parseUserIntentTodo(userMessage)
        : this.parseUserIntentWhatsOnYourMind(userMessage);

    // Choose model based on mode
    const model = mode === "todo" ? "gpt2" : "fmicrosoft/DialoGPT-small"; // Free conversational model

    // Generate a more natural response
    const aiResponse = await this.generateResponse(
      `User: ${userMessage}\nAssistant: ${intent.message}`,
      model
    );

    return {
      ...intent,
      message: aiResponse,
    };
  }
}
