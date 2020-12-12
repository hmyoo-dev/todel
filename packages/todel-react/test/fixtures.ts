import { actionCreator, ActionHandler, Atom, Controller } from "todel";

export const increase = actionCreator("increase");
export const setCount = actionCreator<number>("setCount");

export interface CounterState {
  count: number;
}

export class CounterAtom extends Atom<CounterState> {
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
export interface CounterRepo {
  counter: CounterAtom;
}
