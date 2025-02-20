import { describe, expect, it } from "vitest";
import { Commands } from "./commands";
import { BankAccountRepo } from "./bankAccountRepo";
import { Logger } from "../logger";
import { Queries } from "./queries";

describe("accounting", () => {
  const bankAccountRepo = BankAccountRepo({ debug: () => {}, warn: () => {} } as unknown as Logger);
  const commands = Commands(bankAccountRepo);
  const queries = Queries(bankAccountRepo);

  describe("open", () => {
    it("should open account", async () => {
      const { id } = await commands.open("foo-customer-id");
      expect(id).toBeDefined();

      const { balance } = await queries.getBalance(id);
      expect(balance).toBe(0);
    });
  });

  describe("deposit", () => {
    it("should throw if back account does not exists", async () => {
      await expect(commands.deposit("foo-id", 20)).rejects.toThrow("Account with id foo-id not found");
    });

    it("should deposit", async () => {
      const { id } = await commands.open("foo-customer-id");
      await commands.deposit(id, 100);

      const { balance } = await queries.getBalance(id);
      expect(balance).toBe(100);
    });
  });

  describe("deposit", () => {
    it("should throw if back account does not exists", async () => {
      await expect(commands.withdraw("foo-id", 20)).rejects.toThrow("Account with id foo-id not found");
    });

    it("should throw if amount exceed balance", async () => {
      const { id } = await commands.open("foo-customer-id");
      await commands.deposit(id, 50);
      await expect(commands.withdraw(id, 100)).rejects.toThrow("Withdraw failed due INSUFFICIENT_BALANCE");
    });

    it("should withdraw", async () => {
      const { id } = await commands.open("foo-customer-id");
      await commands.deposit(id, 100);
      await commands.withdraw(id, 50);

      const { balance } = await queries.getBalance(id);
      expect(balance).toBe(50);
    });
  });
});
