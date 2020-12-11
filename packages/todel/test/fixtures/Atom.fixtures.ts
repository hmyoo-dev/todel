import { Atom } from "../../src/Atom";

export interface CounterAtomState {
  count: number;
}

export interface CounterComputed {
  getRest(max: number): number;
}

export class CounterAtom extends Atom<CounterAtomState, CounterComputed> {
  static fromCount(count: number): CounterAtom {
    return new CounterAtom({ count });
  }

  increase(): void {
    this.updateState((state) => ({ ...state, count: state.count + 1 }));
  }

  get computed(): CounterComputed {
    return {
      getRest: (max) => max - this.state.count,
    };
  }
}

export class OnlyStateAtom extends Atom<CounterAtomState> {}
