import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import type { User } from "@supabase/supabase-js";

export class UserService {
  static async createUserFromSupabase(supabaseUser: User) {
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, supabaseUser.id));

    if (existingUser.length > 0) {
      return existingUser[0];
    }

    const [user] = await db
      .insert(users)
      .values({
        id: supabaseUser.id || "",
        email: supabaseUser.email || "",
        fullName:
          supabaseUser.user_metadata && supabaseUser.user_metadata.full_name
            ? supabaseUser.user_metadata.full_name
            : null,
        avatarUrl:
          supabaseUser.user_metadata && supabaseUser.user_metadata.avatar_url
            ? supabaseUser.user_metadata.avatar_url
            : null,
      })
      .returning();
    return user;
  }

  static async getUser(userId: string) {
    const [user] = await db.select().from(users).where(eq(users.id, userId));
    return user;
  }
}
