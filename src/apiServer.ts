import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { Config } from "./config";
import { Logger } from "./logger";

export type ApiServer = ReturnType<typeof ApiServer>;
export function ApiServer(config: Config, logger: Logger) {
  const app = new Hono();

  app.get("/", (c) => {
    return c.text("bank api");
  });

  async function initialize() {
    serve(
      {
        fetch: app.fetch,
        port: 3000,
      },
      (info) => {
        logger.debug({ ...info }, `apiServer.started`);
      },
    );
  }

  return { initialize, app };
}
