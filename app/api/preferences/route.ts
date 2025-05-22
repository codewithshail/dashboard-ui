import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { users } from "@/lib/db/schema";

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { selectedPreferences } = await request.json();
    
    if (!Array.isArray(selectedPreferences)) {
      return NextResponse.json({ error: "Invalid preferences format" }, { status: 400 });
    }


    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (dbUser.length === 0) {
      return NextResponse.json({ error: "User not found in database" }, { status: 404 });
    }


    const { saveUserPreferences } = await import("@/lib/preferences");
    const result = await saveUserPreferences(dbUser[0].id, selectedPreferences);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in preferences API:", error);
    return NextResponse.json({ 
      error: "Internal server error", 
      details: error instanceof Error ? error.message : "Unknown error" 
    }, { status: 500 });
  }
}