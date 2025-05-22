import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { users, userPreferences } from "@/lib/db/schema";
import { UserProvider } from "@/providers/user-providers";
import { PrimarySidebar } from "@/components/dashboard/sidebar/primary-sidebar";

async function ensureUserExists() {
  const { userId } = await auth();
  const clerkUser = await currentUser();
  
  if (!userId || !clerkUser) {
    redirect("/sign-in");
  }

  try {

    let existingUser = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, userId))
      .limit(1);

    if (existingUser.length === 0) {
      const newUserData = {
        clerkId: userId,
        email: clerkUser?.primaryEmailAddress?.emailAddress!,
        username: clerkUser.username || clerkUser.firstName,
        image: clerkUser.imageUrl || null,
        purchasedCoins: 100,
      };

      const [newUser] = await db.insert(users).values(newUserData).returning();
      existingUser = [newUser];
      console.log(`Created new user: ${userId}`);
    }

    return existingUser[0];
  } catch (error) {
    console.error("Error ensuring user exists:", error);
    throw new Error("Failed to initialize user");
  }
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userData = await ensureUserExists();
  
  const preferences = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userData.id))
    .limit(1);

  if (preferences.length === 0) {
    redirect("/preferences");
  }

  return (
    <UserProvider userData={userData}>
      <div className="flex h-screen">
      <PrimarySidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      </div>
    </UserProvider>
  );
}