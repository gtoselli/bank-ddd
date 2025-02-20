import { describe, expect, it } from "vitest";
import {
  BankAccount,
  bankAccountDeciderFactory,
  DepositCommand,
  NotOpenedEvent,
  NotWithdrawnEvent,
  OpenCommand,
  WithdrawCommand,
} from "./bankAccount";
import { useDecider } from "../../utils/useDecider";

describe("bankAccount", () => {
  describe("open", () => {
    it("case account not exists, should open", () => {
      const command: OpenCommand = {
        kind: "OpenCommand",
        id: "foo-id",
        customerId: "foo-customer-id",
      };

      const { state } = useDecider(bankAccountDeciderFactory(), command, null);
      expect(state).toEqual({
        balance: 0,
        customerId: "foo-customer-id",
        id: "foo-id",
      });
    });

    it("case account already opened, should fail", () => {
      const command: OpenCommand = {
        kind: "OpenCommand",
        id: "foo-id",
        customerId: "foo-customer-id",
      };
      const initialState: BankAccount = {
        balance: 0,
        customerId: "foo-customer-id",
        id: "foo-id",
      };

      const { state, events } = useDecider(bankAccountDeciderFactory(), command, initialState);
      expect(state).toEqual(initialState);
      expect((events[0] as NotOpenedEvent).reason).toEqual("ALREADY_OPENED");
    });
  });

  describe("withdraw", () => {
    it("case account not  exists, should fail", () => {
      const command: WithdrawCommand = {
        kind: "WithdrawCommand",
        id: "foo-id",
        amount: 20,
      };

      const initialState = null;

      const { state, events } = useDecider(bankAccountDeciderFactory(), command, initialState);
      expect(state).toEqual(initialState);
      expect((events[0] as NotWithdrawnEvent).reason).toEqual("ACCOUNT_NOT_OPENED");
    });

    it("case insufficient balance, should fail", () => {
      const command: WithdrawCommand = {
        kind: "WithdrawCommand",
        id: "foo-id",
        amount: 20,
      };

      const initialState: BankAccount = {
        balance: 10,
        customerId: "foo-customer-id",
        id: "foo-id",
      };

      const { state, events } = useDecider(bankAccountDeciderFactory(), command, initialState);
      expect(state).toEqual(initialState);
      expect((events[0] as NotWithdrawnEvent).reason).toEqual("INSUFFICIENT_BALANCE");
    });

    it("case sufficient balance, should update balance", () => {
      const command: WithdrawCommand = {
        kind: "WithdrawCommand",
        id: "foo-id",
        amount: 10,
      };

      const initialState: BankAccount = {
        balance: 20,
        customerId: "foo-customer-id",
        id: "foo-id",
      };

      const { state } = useDecider(bankAccountDeciderFactory(), command, initialState);
      expect(state).toMatchObject({
        balance: 10,
      });
    });
  });

  describe("deposit", () => {
    it("case account not exists, should fail", () => {
      const command: DepositCommand = {
        kind: "DepositCommand",
        id: "foo-id",
        amount: 20,
      };

      const initialState = null;

      const { state, events } = useDecider(bankAccountDeciderFactory(), command, initialState);
      expect(state).toEqual(initialState);
      expect((events[0] as NotWithdrawnEvent).reason).toEqual("ACCOUNT_NOT_OPENED");
    });

    it("should update balance", () => {
      const command: DepositCommand = {
        kind: "DepositCommand",
        id: "foo-id",
        amount: 10,
      };

      const initialState: BankAccount = {
        balance: 20,
        customerId: "foo-customer-id",
        id: "foo-id",
      };

      const { state } = useDecider(bankAccountDeciderFactory(), command, initialState);
      expect(state).toMatchObject({
        balance: 30,
      });
    });
  });
});
