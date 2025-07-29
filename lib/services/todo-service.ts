import { db } from "../db";
import { todos, aiChatHistory } from "../db/schema";
import { eq, and, desc } from "drizzle-orm";
import { AIService, AIResponse } from "../ai/huggingface";
import { createClient } from "@/lib/supabase/server";

export interface CreateTodoData {
  title: string;
  description?: string;
  dueDate?: Date;
}

export interface UpdateTodoData {
  title?: string;
  description?: string;
  isCompleted?: boolean;
  dueDate?: Date;
}

export class TodoService {
  // Manual CRUD
  static async createTodo(userId: string, data: CreateTodoData) {
    const [todo] = await db
      .insert(todos)
      .values({
        userId,
        title: data.title,
        description: data.description,
        dueDate: data.dueDate,
      })
      .returning();
    return todo;
  }

  static async getTodos(userId: string) {
    return await db
      .select()
      .from(todos)
      .where(eq(todos.userId, userId))
      .orderBy(desc(todos.createdAt));
  }

  static async getTodo(userId: string, todoId: string) {
    const [todo] = await db
      .select()
      .from(todos)
      .where(and(eq(todos.id, todoId), eq(todos.userId, userId)));
    return todo;
  }

  static async updateTodo(
    userId: string,
    todoId: string,
    data: UpdateTodoData
  ) {
    const [updatedTodo] = await db
      .update(todos)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(todos.id, todoId), eq(todos.userId, userId)))
      .returning();
    return updatedTodo;
  }

  static async deleteTodo(userId: string, todoId: string) {
    await db
      .delete(todos)
      .where(and(eq(todos.id, todoId), eq(todos.userId, userId)));
  }

  // AI Read and Create
  static async processAICommand(
    userId: string,
    message: string
  ): Promise<AIResponse> {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return {
        action: "unknown",
        entity: "unknown",
        message: "Unauthorized",
        data: null,
      };
    }

    const aiResponse = await AIService.processMessage(message);
    // Save chat history
    await db.insert(aiChatHistory).values({
      userId,
      message,
      response: aiResponse.message,
      action: aiResponse.action,
      entityType: aiResponse.entity,
    });
    // Handle AI Read and Create for todos
    if (aiResponse.entity === "todo") {
      switch (aiResponse.action) {
        case "create": {
          // Extract title and description from message
          // Match 'todo:' followed by anything up to 'description:' or end of string
          const titleMatch = message.match(
            /todo[:\s]+([^\n,]+?)(?=\s+description:|$)/i
          );
          const descriptionMatch = message.match(/description[:\s]+([^\n,]+)/i);
          const title = titleMatch ? titleMatch[1].trim() : "Untitled Todo";
          const description = descriptionMatch
            ? descriptionMatch[1].trim()
            : undefined;
          const todo = await this.createTodo(userId, { title, description });
          return {
            ...aiResponse,
            data: todo,
            message: `Todo created: ${todo.title}`,
          };
        }
        case "list":
        case "read": {
          const todosList = await this.getTodos(userId);
          return {
            ...aiResponse,
            data: todosList,
            message: `You have ${todosList.length} todos.`,
          };
        }
        default:
          return aiResponse;
      }
    }
    return aiResponse;
  }
}
