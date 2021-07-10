import { createLocalAtomContext } from "@todel/react";
import { atomCreator, AtomSetupPayload } from "todel";

export const createCounterAtom = atomCreator(
  ({ initState = 0, setState }: AtomSetupPayload<number>) => {
    return {
      initState,
      modifiers: {
        increase(): void {
          setState((count) => count + 1);
        },
        decrease(): void {
          setState((count) => count - 1);
        },
        reset(): void {
          setState(() => initState);
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
