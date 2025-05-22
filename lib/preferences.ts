import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { userPreferences } from "@/lib/db/schema";
import { PREFERENCE_OPTIONS, toolCategories } from "./constants";

export async function saveUserPreferences(userId: string, selectedPreferenceIds: string[]) {
  try {

    const allTags = PREFERENCE_OPTIONS
      .filter(option => selectedPreferenceIds.includes(option.id))
      .flatMap(option => option.tags);


    const uniqueTags = [...new Set(allTags)];


    const matchingToolIds: string[] = [];
    
    toolCategories.forEach(category => {
      category.tools.forEach(tool => {
        const hasMatchingTag = tool.tags.some(tag => uniqueTags.includes(tag));
        if (hasMatchingTag && !matchingToolIds.includes(tool.id)) {
          matchingToolIds.push(tool.id);
        }
      });
    });


    const existingPreferences = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);

    if (existingPreferences.length > 0) {

      await db
        .update(userPreferences)
        .set({
          tags: uniqueTags,
          toolIds: matchingToolIds,
          updatedAt: new Date()
        })
        .where(eq(userPreferences.userId, userId));
    } else {

      await db.insert(userPreferences).values({
        userId,
        tags: uniqueTags,
        toolIds: matchingToolIds
      });
    }

    return { success: true, tags: uniqueTags, toolIds: matchingToolIds };
  } catch (error) {
    console.error("Error saving user preferences:", error);
    throw new Error("Failed to save preferences");
  }
}

export async function getUserPreferences(userId: string) {
  try {
    const preferences = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);

    return preferences[0] || null;
  } catch (error) {
    console.error("Error fetching user preferences:", error);
    return null;
  }
}

export function getRecommendedTools(userToolIds: string[]) {
  const recommendedTools: any[] = [];
  
  toolCategories.forEach(category => {
    category.tools.forEach(tool => {
      if (userToolIds.includes(tool.id)) {
        recommendedTools.push({
          ...tool,
          category: category.title
        });
      }
    });
  });

  return recommendedTools;
}
