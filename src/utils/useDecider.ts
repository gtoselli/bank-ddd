import { Decider } from "@fraktalio/fmodel-ts";

export function useDecider<C, S, E>(decider: Decider<C, S, E>, command: C, initialState: S) {
  const events = decider.decide(command, initialState);
  const state = events.reduce(decider.evolve, initialState);
  return { events, state };
}
