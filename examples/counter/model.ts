import { actionCreator, ActionEvent, Controller, Service } from "todel";

// actions
export const reset = actionCreator("reset");
export const increase = actionCreator("increase");
export const decrease = actionCreator("decrease");

// service
export interface CounterState {
  count: number;
}

export class CounterService extends Service<CounterState> {
  constructor() {
    super({ count: 0 });
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

export type CounterServiceHolder = {
  counter: CounterService;
};

// controller
export class CounterController implements Controller {
  constructor(private counterService: CounterService) {}

  listener({ action }: ActionEvent): void {
    if (increase.match(action)) {
      this.counterService.increase();
      return;
    }
    if (decrease.match(action)) {
      this.counterService.decrease();
      return;
    }
    if (reset.match(action)) {
      this.counterService.reset();
      return;
    }
  }
}
