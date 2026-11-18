import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ path: [".env.local", ".env"] });

const envSchema = z.object({
  PORT: z.coerce.number().int().positive().default(3000)
});

export const env = envSchema.parse(process.env);
