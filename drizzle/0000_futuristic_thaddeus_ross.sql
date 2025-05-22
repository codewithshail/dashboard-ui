CREATE TABLE "user_preferences" (
	"user_id" uuid NOT NULL,
	"tags" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"tool_ids" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "user_preferences_user_id_pk" PRIMARY KEY("user_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"username" text,
	"image" text,
	"purchased_coins" integer DEFAULT 100,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;