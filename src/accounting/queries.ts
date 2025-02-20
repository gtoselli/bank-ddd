import { BankAccountRepo } from "./bankAccountRepo";

export type Queries = ReturnType<typeof Queries>;
export function Queries(repo: BankAccountRepo) {
  async function getBalance(id: string) {
    const state = await repo.getById(id);

    return { balance: state.balance };
  }

  return { getBalance };
}
