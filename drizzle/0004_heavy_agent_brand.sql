ALTER TABLE "accounts" DROP CONSTRAINT "accounts_account_id_unique";--> statement-breakpoint
ALTER TABLE "accounts" ALTER COLUMN "user_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "verifications" ALTER COLUMN "expires_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "refresh_token" text;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "access_token_expires_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "refresh_token_expires_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "refresha_token";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "accessTokenExpiredAt";--> statement-breakpoint
ALTER TABLE "accounts" DROP COLUMN "refreshTokenExpiredAt";