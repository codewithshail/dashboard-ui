CREATE TABLE "user_recent_tools" (
	"user_id" uuid NOT NULL,
	"tool_id" text NOT NULL,
	"last_used" timestamp DEFAULT now(),
	CONSTRAINT "user_recent_tools_user_id_tool_id_pk" PRIMARY KEY("user_id","tool_id")
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "clerk_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "user_recent_tools" ADD CONSTRAINT "user_recent_tools_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id");