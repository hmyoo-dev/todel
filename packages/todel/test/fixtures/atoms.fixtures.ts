import { atomCreator } from "../../src/atomCreator";
import { AtomSetupPayload } from "../../src/types/atomCreator.type";

export interface CounterDeps {
  step?: number;
}

export type CounterSetupPayload = AtomSetupPayload<number, CounterDeps | void>;

export const createCounterAtom = atomCreator((payload: CounterSetupPayload) => {
  const { initState = 0, getState, setState, deps = {} } = payload;
  const { step = 1 } = deps;

  return {
    initState,
    computed: {
      getDoubled(): number {
        return getState() * 2;
      },
    },
    modifiers: {
      increase(): void {
        setState((state) => state + step);
      },
      decrease(): void {
        setState((state) => state - step);
      },
    },
  };
});

export type CounterAtom = ReturnType<typeof createCounterAtom>;
