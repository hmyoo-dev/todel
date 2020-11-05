import { Service } from "../src/Service";

describe("Service", () => {
  it("created with initial value.", () => {
    const counter = new StateService({ count: 0 });
    expect(counter.state.count).toBe(0);
  });

  it("should update state with a modifier", () => {
    const counter = new StateService({ count: 1 });
    counter.increase();
    expect(counter.state.count).toBe(2);
  });

  it("should be subscribed for watching changes", (done) => {
    const counter = new StateService({ count: 0 });

    counter.subscribe(({ count }) => {
      expect(count).toBe(-1);
      done();
    });

    counter.decrease();
  });

  it("should return state object when serialize", () => {
    const counter = new StateService({ count: 10 });

    expect(counter.toJson()).toEqual({ count: 10 });
  });

  it("could override the serialize method", () => {
    const counter = new SimpleService({ count: 20 });

    expect(counter.toJson()).toEqual(20);
  });
});

// mock classes
interface State {
  count: number;
}

class StateService extends Service<State> {
  increase(): void {
    this.updateState((state) => ({ ...state, count: state.count + 1 }));
  }

  decrease(): void {
    this.updateState((state) => ({ ...state, count: state.count - 1 }));
  }
}

class SimpleService extends Service<State> {
  toJson(): number {
    return this.state.count;
  }
}
