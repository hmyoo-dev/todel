import { createLocalAtomContext } from "@todel/react";
import { atomCreator, AtomSetupPayload, modifier } from "todel";

export const createCounterAtom = atomCreator(
  ({ initState = 0, setState }: AtomSetupPayload<number>) => {
    return {
      initState,
      increase: modifier(() => setState((count) => count + 1)),
      decrease: modifier(() => setState((count) => count - 1)),
      reset: modifier(() => setState(() => initState)),
    };
  }
);

export type CounterAtom = ReturnType<typeof createCounterAtom>;

export const {
  Provider: CounterProvider,
  useLocalAtomData: useCounterAtomData,
  useLocalAtomModifiers: useCounterAtomModifiers,
} = createLocalAtomContext<CounterAtom>();
