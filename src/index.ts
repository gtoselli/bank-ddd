import { ApiServer } from "./apiServer";
import { Logger } from "./logger";
import { Config } from "./config";
import { AccountingModule } from "./accounting";
import { CustomerManagementModule } from "./customer-management";

let config: Config;
let logger: Logger;
let apiServer: ApiServer;
let accountingModule: AccountingModule;
let customerManagementModule: CustomerManagementModule;

async function main() {
  config = Config();
  logger = Logger(config);
  apiServer = ApiServer(config, logger);
  accountingModule = AccountingModule(logger, apiServer);
  customerManagementModule = CustomerManagementModule(logger, apiServer);

  await accountingModule.initialize();
  await customerManagementModule.initialize();

  await apiServer.initialize();
  logger.info("app.initialized");
}

async function dispose() {
  logger.info("app.disposed");
}

process.on("SIGINT", () => {
  dispose().finally(() => process.exit());
});

main().catch((_e) => {
  process.exit(1);
});
