import { ApiServer } from "../apiServer";
import { Commands } from "./commands";
import { z } from "zod";
import { Queries } from "./queries";
import { honoJsonZodValidator, honoQueryZodValidator } from "../utils/honoZodValidators";

export function Routes(apiServer: ApiServer, commands: Commands, queries: Queries) {
  async function initialize() {
    const baseRoute = apiServer.app.basePath("/accounting");

    baseRoute.post("open", honoJsonZodValidator(openRouteSchema), async (c) => {
      const body = c.req.valid("json");
      const { id } = await commands.open(body.customerId);

      return c.json({ success: true, id });
    });

    baseRoute.post("withdraw", honoJsonZodValidator(withdrawRouteSchema), async (c) => {
      const body = c.req.valid("json");
      await commands.withdraw(body.id, body.amount);

      return c.json({ success: true });
    });

    baseRoute.post("deposit", honoJsonZodValidator(depositRouteSchema), async (c) => {
      const body = c.req.valid("json");
      await commands.deposit(body.id, body.amount);

      return c.json({ success: true });
    });

    baseRoute.get("/accounting", honoQueryZodValidator(getBalanceRouteSchema), async (c) => {
      const params = c.req.valid("query");

      const balance = await queries.getBalance(params.id);
      return c.json({ ...balance });
    });
  }

  return { initialize };
}

const openRouteSchema = z.object({
  customerId: z.string(),
});
const withdrawRouteSchema = z.object({
  id: z.string(),
  amount: z.number(),
});
const depositRouteSchema = z.object({
  id: z.string(),
  amount: z.number(),
});
const getBalanceRouteSchema = z.object({
  id: z.string(),
});
