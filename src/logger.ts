import pino from "pino";
import { Config } from "./config";

export type Logger = ReturnType<typeof Logger>;
export function Logger(config: Config, name?: string) {
  return pino({
    level: config.get("LOG_LEVEL"),
    name,
    transport:
      config.get("ENV_NAME") === "local"
        ? {
            target: "pino-pretty",
            options: {
              colorize: true,
            },
          }
        : undefined,
  });
}
