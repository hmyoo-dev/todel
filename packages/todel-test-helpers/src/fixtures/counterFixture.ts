import { actionCreator, ActionHandler, Atom, Controller, Store } from "todel";
import { mockStore } from "../helpers";

export const increase = actionCreator("increase");
export const setCount = actionCreator<number>("setCount");

export interface CounterState {
  count: number;
}

export class CounterAtom extends Atom<CounterState> {
  static fromCount(count: number): CounterAtom {
    return new CounterAtom({ count });
  }

  increase(): void {
    this.updateState((state) => ({ ...state, count: state.count + 1 }));
  }
  setCount(count: number): void {
    this.updateState((state) => ({ ...state, count }));
  }
}

export class CounterController implements Controller {
  constructor(private counterAtom: CounterAtom) {}

  getHandler(): ActionHandler {
    return (action) => {
      if (increase.match(action)) {
        this.counterAtom.increase();
        return;
      }
      if (setCount.match(action)) {
        this.counterAtom.setCount(action.payload);
        return;
      }
    };
  }
}
export interface CounterAtomHolder {
  counter: CounterAtom;
}

export function counterStoreFixture(count = 0): Store<CounterAtomHolder> {
  const counter = new CounterAtom({ count });
  const controller = new CounterController(counter);

  return mockStore<CounterAtomHolder>({ counter }, [controller]);
}
