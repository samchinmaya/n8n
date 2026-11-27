import { drizzle } from "drizzle-orm/bun-sql";

import * as schema from "./schema/index.ts";

export const db = drizzle(process.env.DATABASE_URL!, { schema });
