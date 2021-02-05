import { createLocalAtomContext } from "@todel/react";
import { Atom } from "todel";

export interface CounterState {
  count: number;
}

export class CounterAtom extends Atom<CounterState> {
  static fromCount(count: number): CounterAtom {
    return new CounterAtom({ count });
  }

  increase = (): void => {
    this.updateState((state) => ({ ...state, count: state.count + 1 }));
  };
  decrease = (): void => {
    this.updateState((state) => ({ ...state, count: state.count - 1 }));
  };
  reset = (): void => {
    this.updateState((state) => ({ ...state, count: 0 }));
  };
}

export const {
  Provider: CounterProvider,
  useLocalAtom: useCounterAtom,
} = createLocalAtomContext<CounterAtom>();
