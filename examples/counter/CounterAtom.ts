import { createLocalAtomContext } from "@todel/react";
import { atomCreator, AtomSetupPayload } from "todel";

export interface CounterState {
  count: number;
}

export const createCounterAtom = atomCreator(
  ({ initState = { count: 0 }, setState }: AtomSetupPayload<CounterState>) => {
    return {
      initState,
      modifiers: {
        increase(): void {
          setState((state) => ({ ...state, count: state.count + 1 }));
        },
        decrease(): void {
          setState((state) => ({ ...state, count: state.count - 1 }));
        },
        reset(): void {
          setState((state) => ({ ...state, count: 0 }));
        },
      },
    };
  }
);

export type CounterAtom = ReturnType<typeof createCounterAtom>;

export const {
  Provider: CounterProvider,
  useLocalAtomData: useCounterAtomData,
  useLocalAtomModifiers: useCounterAtomModifiers,
} = createLocalAtomContext<CounterAtom>();
