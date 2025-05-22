import { sql } from "drizzle-orm";
import { integer, jsonb, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  clerkId: text('clerk_id').notNull().unique(),
  email: text('email').notNull(),
  username: text('username'),
  image: text('image'),
  purchasedCoins: integer('purchased_coins').default(100),
  createdAt: timestamp('created_at').defaultNow(),
});

export const userPreferences = pgTable('user_preferences', {
  userId: uuid('user_id').references(() => users.id).notNull(),
  tags: jsonb('tags').$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  toolIds: jsonb('tool_ids').$type<string[]>().notNull().default(sql`'[]'::jsonb`),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId] }),
}));

export const userRecentTools = pgTable('user_recent_tools', {
  userId: uuid('user_id').references(() => users.id).notNull(),
  toolId: text('tool_id').notNull(),          
  lastUsedAt: timestamp('last_used_at').defaultNow(),
}, (t) => ({
  pk: primaryKey({ columns: [t.userId, t.toolId] }),
}));