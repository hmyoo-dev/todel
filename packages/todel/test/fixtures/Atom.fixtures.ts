import { Atom } from "../../src/Atom";

export interface CounterAtomState {
  count: number;
}

export class CounterAtom extends Atom<CounterAtomState> {
  static fromCount(count: number): CounterAtom {
    return new CounterAtom({ count });
  }

  increase(): void {
    this.updateState((state) => ({ ...state, count: state.count + 1 }));
  }

  decrease(): void {
    this.updateState((state) => ({ ...state, count: state.count - 1 }));
  }
}

export class OnlyStateAtom extends Atom<CounterAtomState> {}
