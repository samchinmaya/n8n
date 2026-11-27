ALTER TABLE "sessions" ALTER COLUMN "ip_address" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "verifications" ADD COLUMN "expires_at" timestamp with time zone DEFAULT now() NOT NULL;