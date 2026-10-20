import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "./user.ts";

export const account = pgTable("accounts", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull().unique(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").references(() => user.id, { onDelete: "cascade" }),
  password: text("password"),
  accessToken: text("access_token"),
  refrshToken: text("refresha_token"),
  idToken:text('id_token'),
  accessTokenExpiredAt: timestamp("accessTokenExpiredAt", { withTimezone: true }),
  refreshTokenExpiredAt: timestamp("refreshTokenExpiredAt", { withTimezone: true }),
  scope: text("scope"),
  createdAt: timestamp("created_at",{withTimezone:true}).notNull().defaultNow(),
  updatedAt: timestamp("updated_at",{withTimezone:true}).notNull().defaultNow(),

})
