import { createDataHook } from "@todel/react";
import { actionCreator, ActionHandler, Atom, Controller } from "todel";

// actions
export const reset = actionCreator("reset");
export const increase = actionCreator("increase");
export const decrease = actionCreator("decrease");

// service
export interface CounterState {
  count: number;
}

export class Counter extends Atom<CounterState> {
  static fromCount(count: number): Counter {
    return new Counter({ count });
  }

  increase(): void {
    this.updateState((state) => ({ ...state, count: state.count + 1 }));
  }
  decrease(): void {
    this.updateState((state) => ({ ...state, count: state.count - 1 }));
  }
  reset(): void {
    this.updateState((state) => ({ ...state, count: 0 }));
  }
}

export interface CounterHolder {
  counter: Counter;
}

export const useCounterData = createDataHook(
  (repo: CounterHolder) => repo.counter
);

// controller
export class CounterController implements Controller {
  constructor(private counter: Counter) {}

  getHandler(): ActionHandler {
    return (action) => {
      if (increase.match(action)) {
        this.counter.increase();
        return;
      }
      if (decrease.match(action)) {
        this.counter.decrease();
        return;
      }
      if (reset.match(action)) {
        this.counter.reset();
        return;
      }
    };
  }
}
