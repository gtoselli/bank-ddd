import { Decider } from "@fraktalio/fmodel-ts";

export type OpenCommand = {
  readonly kind: "OpenCommand";
  readonly id: string;
  readonly customerId: string;
};

export type WithdrawCommand = {
  readonly kind: "WithdrawCommand";
  readonly id: string;
  readonly amount: number;
};

export type DepositCommand = {
  readonly kind: "DepositCommand";
  readonly id: string;
  readonly amount: number;
};

export type Command = OpenCommand | WithdrawCommand | DepositCommand;

export type OpenedEvent = {
  readonly kind: "OpenedEvent";
  readonly id: string;
  readonly customerId: string;
};

export type NotOpenedEvent = {
  readonly kind: "NotOpenedEvent";
  readonly id: string;
  readonly reason: string;
};

export type WithdrawnEvent = {
  readonly kind: "WithdrawnEvent";
  readonly id: string;
  readonly amount: number;
};

export type NotWithdrawnEvent = {
  readonly kind: "NotWithdrawnEvent";
  readonly id: string;
  readonly amount: number;
  readonly reason: "ACCOUNT_NOT_OPENED" | "INSUFFICIENT_BALANCE";
};

export type DepositedEvent = {
  readonly kind: "DepositedEvent";
  readonly id: string;
  readonly amount: number;
};

export type NotDepositedEvent = {
  readonly kind: "NotDepositedEvent";
  readonly id: string;
  readonly amount: number;
  readonly reason: "ACCOUNT_NOT_OPENED";
};

export type Event = OpenedEvent | NotOpenedEvent | WithdrawnEvent | NotWithdrawnEvent | DepositedEvent | NotDepositedEvent;

export type BankAccount = {
  readonly id: string;
  readonly customerId: string;
  readonly balance: number;
};

export type BankAccountState = BankAccount | null;

function decide(command: Command, currentState: BankAccountState): Event[] {
  switch (command.kind) {
    case "OpenCommand": {
      if (currentState !== null) {
        return [
          {
            kind: "NotOpenedEvent",
            id: command.id,
            reason: "ALREADY_OPENED",
          } satisfies NotOpenedEvent,
        ];
      }
      return [
        {
          kind: "OpenedEvent",
          id: command.id,
          customerId: command.customerId,
        } satisfies OpenedEvent,
      ];
    }

    case "WithdrawCommand": {
      if (currentState === null) {
        return [
          {
            kind: "NotWithdrawnEvent",
            id: command.id,
            amount: command.amount,
            reason: "ACCOUNT_NOT_OPENED",
          } satisfies NotWithdrawnEvent,
        ];
      }

      if (currentState.balance < command.amount) {
        return [
          {
            kind: "NotWithdrawnEvent",
            id: command.id,
            amount: command.amount,
            reason: "INSUFFICIENT_BALANCE",
          } satisfies NotWithdrawnEvent,
        ];
      }

      return [
        {
          kind: "WithdrawnEvent",
          id: command.id,
          amount: command.amount,
        } satisfies WithdrawnEvent,
      ];
    }

    case "DepositCommand":
      if (currentState === null) {
        return [
          {
            kind: "NotDepositedEvent",
            id: command.id,
            amount: command.amount,
            reason: "ACCOUNT_NOT_OPENED",
          },
        ];
      }

      return [
        {
          kind: "DepositedEvent",
          id: command.id,
          amount: command.amount,
        },
      ];
    default: {
      return [];
    }
  }
}

function evolve(currentState: BankAccountState, event: Event): BankAccountState {
  switch (event.kind) {
    case "OpenedEvent":
      return { id: event.id, customerId: event.customerId, balance: 0 };
    case "WithdrawnEvent":
      return currentState !== null && currentState.id === event.id ? { ...currentState, balance: currentState.balance - event.amount } : currentState;
    case "DepositedEvent":
      return currentState !== null && currentState.id === event.id ? { ...currentState, balance: currentState.balance + event.amount } : currentState;
    default: {
      return currentState;
    }
  }
}

export function bankAccountDeciderFactory(initialState: BankAccountState = null) {
  return new Decider<Command, BankAccount | null, Event>(decide, evolve, initialState);
}
