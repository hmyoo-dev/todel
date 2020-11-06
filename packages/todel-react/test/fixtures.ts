import { Action, actionCreator, Controller, Service } from "todel";

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

export class CounterController implements Controller {
  constructor(private counterService: CounterService) {}

  listener(action: Action): void {
    if (increase.match(action)) {
      return this.counterService.increase();
    }
    if (setCount.match(action)) {
      return this.counterService.setCount(action.payload);
    }
  }
}

export type CounterServiceRepo = {
  counter: CounterService;
};
