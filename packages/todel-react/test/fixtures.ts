import { Action, actionCreator, Controller, Service } from "todel";

export const increase = actionCreator("increase");

export interface CounterState {
  count: number;
}

export class CounterService extends Service<CounterState> {
  increase(): void {
    this.updateState((state) => ({ ...state, count: state.count + 1 }));
  }
}

export class CounterController implements Controller {
  constructor(private counterService: CounterService) {}

  listener(action: Action): void {
    if (increase.match(action)) {
      this.counterService.increase();
    }
  }
}

export type CounterServiceRepo = {
  counter: CounterService;
};
