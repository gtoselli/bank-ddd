import { validator } from "hono/validator";
import { z } from "zod";
import { Context } from "hono";

export function honoJsonZodValidator<T>(schema: z.Schema<T>) {
  return validator("json", (value: unknown, c: Context): T | Response => {
    const parsed = schema.safeParse(value);
    if (!parsed.success) {
      return c.json({ issues: parsed.error.issues, type: "json" }, 400);
    }
    return parsed.data;
  });
}

export function honoQueryZodValidator<T>(schema: z.Schema<T>) {
  return validator("query", (value: unknown, c: Context): T | Response => {
    const parsed = schema.safeParse(value);
    if (!parsed.success) {
      return c.json({ issues: parsed.error.issues, type: "query" }, 400);
    }
    return parsed.data;
  });
}
