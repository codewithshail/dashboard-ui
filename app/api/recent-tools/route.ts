import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { eq, desc } from "drizzle-orm";
import { users, userRecentTools } from "@/lib/db/schema";
import { toolCategories } from "@/lib/constants";

export async function GET() {
  const { userId: clerkId } = await auth();
  
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userRecord = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    if (userRecord.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = userRecord[0].id;
    
    const recentToolIds = await db
      .select()
      .from(userRecentTools)
      .where(eq(userRecentTools.userId, userId))
      .orderBy(desc(userRecentTools.lastUsedAt))
      .limit(10);

    const recentTools = recentToolIds.map(record => {
      const toolId = record.toolId;
      let tool;
      
      for (const category of toolCategories) {
        const found = category.tools.find(t => t.id === toolId);
        if (found) {
          tool = { ...found, category: category.title };
          break;
        }
      }
      
      return { ...record, tool };
    }).filter(item => item.tool); 
    
    return NextResponse.json({ recentTools });
  } catch (error) {
    console.error("Error fetching recent tools:", error);
    return NextResponse.json({ error: "Failed to fetch recent tools" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const { userId: clerkId } = await auth();
  
  if (!clerkId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  
  try {
    const { toolId } = await request.json();
    
    if (!toolId) {
      return NextResponse.json({ error: "Tool ID is required" }, { status: 400 });
    }
    
    const userRecord = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, clerkId))
      .limit(1);

    if (userRecord.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const userId = userRecord[0].id;
    
    await db
      .delete(userRecentTools)
      .where(
        eq(userRecentTools.userId, userId) && 
        eq(userRecentTools.toolId, toolId)
      );
    
    await db.insert(userRecentTools).values({
      userId,
      toolId,
      lastUsedAt: new Date(),
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error adding recent tool:", error);
    return NextResponse.json({ error: "Failed to add recent tool" }, { status: 500 });
  }
}