import { actionCreator, ActionHandler, Atom, Controller, Service } from "todel";

export const increase = actionCreator("increase");
export const setCount = actionCreator<number>("setCount");

export interface CounterState {
  count: number;
}

export class CounterService extends Service<CounterState> {
  increase(): void {
    this.updateState((state) => ({ ...state, count: state.count + 1 }));
  }
  setCount(count: number): void {
    this.updateState((state) => ({ ...state, count }));
  }
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
  constructor(private counterService: CounterService) {}

  getHandler(): ActionHandler {
    return (action) => {
      if (increase.match(action)) {
        this.counterService.increase();
        return;
      }
      if (setCount.match(action)) {
        this.counterService.setCount(action.payload);
        return;
      }
    };
  }
}

export class CounterAtomController implements Controller {
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
export interface CounterAtomRepo {
  counter: CounterAtom;
}

export type CounterServiceRepo = {
  counter: CounterService;
};
