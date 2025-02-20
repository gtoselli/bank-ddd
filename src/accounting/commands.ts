import { BankAccountRepo } from "./bankAccountRepo";
import { v4 } from "uuid";
import { bankAccountDeciderFactory } from "./domain/bankAccount";
import { useDecider } from "../utils/useDecider";

export type Commands = ReturnType<typeof Commands>;
export function Commands(repo: BankAccountRepo) {
  async function open(customerId: string) {
    const id = v4();

    const { state } = useDecider(bankAccountDeciderFactory(), { kind: "OpenCommand", id, customerId }, null);
    await repo.save(state);

    return { id };
  }

  async function withdraw(id: string, amount: number) {
    const currentState = await repo.getById(id);

    const { state, events } = useDecider(
      bankAccountDeciderFactory(currentState),
      {
        kind: "WithdrawCommand",
        id,
        amount,
      },
      currentState,
    );

    if (events[0].kind === "NotWithdrawnEvent") {
      throw new Error(`Withdraw failed due ${events[0].reason}`);
    }

    await repo.save(state);
  }

  async function deposit(id: string, amount: number) {
    const currentState = await repo.getById(id);

    const { state, events } = useDecider(
      bankAccountDeciderFactory(),
      {
        kind: "DepositCommand",
        id,
        amount,
      },
      currentState,
    );

    if (events[0].kind === "NotWithdrawnEvent") {
      throw new Error(`Deposit failed due ${events[0].reason}`);
    }

    await repo.save(state);
  }

  return { open, withdraw, deposit };
}
