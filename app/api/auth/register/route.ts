import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { UserService } from "@/lib/services/user-service";

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName } = await request.json();
    console.log("Registration attempt for:", email);

    // Register with Supabase Auth
    const supabase = await createClient();
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (authError) {
      console.error("Supabase auth error:", authError);
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    console.log("Supabase auth successful, user:", authData.user?.id);

    if (authData.user) {
      // Save user to Drizzle database
      try {
        console.log("Attempting to save user to Drizzle:", authData.user.id);
        const drizzleUser = await UserService.createUserFromSupabase(
          authData.user
        );
        console.log(
          "User saved to Drizzle database successfully:",
          drizzleUser.id
        );
      } catch (dbError) {
        console.error("Error saving user to Drizzle database:", dbError);
        // Return error if Drizzle save fails - this is important for data consistency
        return NextResponse.json(
          {
            error:
              "Registration successful but failed to save user data. Please try again.",
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      message: "Registration successful",
      user: authData.user,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
