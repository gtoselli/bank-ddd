import { Logger } from "pino";
import { BankAccountRepo } from "./bankAccountRepo";
import { Commands } from "./commands";
import { Routes } from "./routes";
import { ApiServer } from "../apiServer";
import { Queries } from "./queries";

export type AccountingModule = ReturnType<typeof AccountingModule>;
export function AccountingModule(logger: Logger, apiServer: ApiServer) {
  const bankAccountRepo = BankAccountRepo(logger);
  const commands = Commands(bankAccountRepo);
  const queries = Queries(bankAccountRepo);
  const routes = Routes(apiServer, commands, queries);

  async function initialize() {
    await routes.initialize();
    logger.debug("accounting.initialized");
  }

  return { initialize };
}
