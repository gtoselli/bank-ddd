import { ApiServer } from "../apiServer";
import { CustomersRepo } from "./customerRepo";
import { honoJsonZodValidator } from "../utils/honoZodValidators";
import { z } from "zod";
import { v4 } from "uuid";

export function Routes(apiServer: ApiServer, customersRepo: CustomersRepo) {
  async function initialize() {
    const baseRoute = apiServer.app.basePath("/customer-management");

    baseRoute.get("customers", async (c) => {
      const customers = await customersRepo.list();
      return c.json(customers);
    });

    baseRoute.get("customers/:id", async (c) => {
      const id = c.req.param("id");
      const customer = await customersRepo.getOrThrow(id);
      return c.json(customer);
    });

    baseRoute.post(
      "customers",
      honoJsonZodValidator(
        z.object({
          firstName: z.string(),
          lastName: z.string(),
          email: z.string(),
        }),
      ),
      async (c) => {
        const body = c.req.valid("json");
        const customer = { ...body, id: v4() };
        await customersRepo.create(customer);
        return c.json(customer);
      },
    );

    baseRoute.put(
      "customers/:id",
      honoJsonZodValidator(
        z.object({
          firstName: z.string(),
          lastName: z.string(),
          email: z.string(),
        }),
      ),
      async (c) => {
        const id = c.req.param("id");
        const body = c.req.valid("json");
        const customer = { ...body, id };
        await customersRepo.update(customer);
        return c.json(customer);
      },
    );

    apiServer.app.delete("customers/:id", async (c) => {
      const id = c.req.param("id");
      const customer = await customersRepo.getOrThrow(id);
      await customersRepo.remove(id);
      return c.json(customer);
    });
  }

  return { initialize };
}
