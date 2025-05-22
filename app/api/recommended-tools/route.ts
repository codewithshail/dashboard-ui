import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { users, userPreferences } from "@/lib/db/schema";
import { toolCategories } from "@/lib/constants";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();
    
    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    if (dbUser.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const preferences = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, dbUser[0].id))
      .limit(1);

    if (preferences.length === 0 || !preferences[0].toolIds) {
      return NextResponse.json({ recommendedTools: [] });
    }

    const toolIds = preferences[0].toolIds as string[];
    const recommendedTools = [];
    
    for (const toolId of toolIds) {
      for (const category of toolCategories) {
        const tool = category.tools.find(t => t.id === toolId);
        if (tool) {
          recommendedTools.push({
            id: tool.id,
            name: tool.title,
            href: tool.href
          });
          break;
        }
      }
    }

    return NextResponse.json({ recommendedTools , toolIds});
  } catch (error) {
    console.error("Error fetching recommended tools:", error);
    return NextResponse.json({ error: "Failed to fetch recommended tools" }, { status: 500 });
  }
}