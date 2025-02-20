import * as dotenv from "dotenv";
import { z } from "zod";

export const EnvSchema = z.object({
  ENV_NAME: z.enum(["local", "dev", "prod"]).default("local"),
  LOG_LEVEL: z.enum(["debug", "info", "warn", "error"]).default("debug"),
});

export type Env = z.infer<typeof EnvSchema>;

dotenv.config();
const result = EnvSchema.safeParse(process.env);
if (!result.success) {
  throw new Error("Environment variables validation failed: " + result.error.errors.map((i) => `${i.path.join(".")}: ${i.message}`).join(", "));
}

export type Config = ReturnType<typeof Config>;
export function Config() {
  function get<K extends keyof Env>(key: K): Env[K] {
    const value = result.data?.[key];
    if (value === undefined) {
      throw new Error(`Missing environment variable ${key}`);
    }
    return value;
  }

  return { get };
}
