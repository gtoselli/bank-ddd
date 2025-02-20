import { BankAccountState } from "./domain/bankAccount";
import { Logger } from "../logger";

export type BankAccountRepo = ReturnType<typeof BankAccountRepo>;
export function BankAccountRepo(logger: Logger) {
  const state: Record<string, BankAccountState> = {};

  async function getById(id: string) {
    const _state = state[id];
    if (!_state) {
      logger.warn({ id }, "bankAccountRepo.getById.notFound");
      throw new Error(`Account with id ${id} not found`);
    }
    return _state;
  }

  async function save(_state: BankAccountState) {
    if (!_state) throw new Error("Bank account state is required");
    state[_state.id] = _state;
    logger.debug({ state: _state }, "bankAccountRepo.save");
  }

  return { getById, save };
}
