import { Logger } from "pino";
import { Routes } from "./routes";
import { ApiServer } from "../apiServer";
import { CustomersRepo } from "./customerRepo";

export type CustomerManagementModule = ReturnType<typeof CustomerManagementModule>;
export function CustomerManagementModule(logger: Logger, apiServer: ApiServer) {
  const customersRepo = CustomersRepo();
  const routes = Routes(apiServer, customersRepo);

  async function initialize() {
    await routes.initialize();
    logger.debug("customerManagement.initialized");
  }

  return { initialize };
}
