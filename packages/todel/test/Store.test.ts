import { actionCreator } from "../src/actionCreators";
import { Service } from "../src/Service";
import { Store } from "../src/Store";
import type {
  ActionHandler,
  Consumer,
  Controller,
  ErrorEmitter,
} from "../src/types";

describe("Store", () => {
  it("can be created by provider", () => {
    const store = new Store(() => {
      const counter = new CounterService({ count: 10 });
      return {
        services: { counter },
        controllers: [new CounterController(counter)],
      };
    });

    expect(store.services.counter.state.count).toEqual(10);
  });

  it("should update state when dispatch a action", () => {
    const store = createStore();
    const { counter } = store.services;

    expect(counter.state.count).toEqual(0);

    store.dispatch(increase());

    expect(counter.state.count).toEqual(1);
  });

  it("can subscribe actions", () => {
    const store = createStore();
    const observer = jest.fn();
    store.subscribeAction(observer);

    const action = increase();

    store.dispatch(action);

    expect(observer).toHaveBeenCalledWith(action);
  });

  it("can dispatch actions", () => {
    const store = createStore();
    const actionTypes: string[] = [];

    store.subscribeAction((action) => {
      actionTypes.push(action.type);
    });

    store.dispatch(triggerDecrease());

    expect(actionTypes).toEqual([triggerDecrease.type, decrease.type]);
  });

  it("should catch error in sync logic", () => {
    const errorHandler = jest.fn();
    const store = createStore(errorHandler);

    store.dispatch(throwError());

    checkErrorHandler(errorHandler, "test");
  });

  it("should catch error in async logic", async () => {
    const errorHandler = jest.fn();
    const store = createStore(errorHandler);

    store.dispatch(throwAsyncError());

    await wait(10);

    checkErrorHandler(errorHandler, "async test");
  });

  it("should catch emitted error", () => {
    const errorHandler = jest.fn();
    const store = createStore(errorHandler);

    store.dispatch(emitErr());

    checkErrorHandler(errorHandler, "test");
  });

  it("should throw error when a handler is not provided", () => {
    const store = createStore();

    expect(() => store.dispatch(throwError())).toThrowError();
  });

  it("should serialize services", () => {
    const store = createStore();
    const result = store.toJson();

    expect(result).toEqual({ counter: { count: 0 } });
  });

  it("could subscribe action emitter", (done) => {
    const store = createStore();

    store.subscribeAction((action) => {
      expect(action.type).toEqual(increase.type);
      done();
    });

    store.dispatch(increase());
  });

  // Helpers
  function checkErrorHandler(handler: jest.Mock, errorMessage: string): void {
    expect(handler).toHaveBeenCalled();
    const [error] = handler.mock.calls[0];
    expect(error).toBeInstanceOf(Error);
    expect(error.message).toEqual(errorMessage);
  }
});

// actions
const increase = actionCreator("increase");
const decrease = actionCreator("decrease");
const triggerDecrease = actionCreator("triggerDecrease");
const throwError = actionCreator("throwError");
const throwAsyncError = actionCreator("throwAsyncError");
const emitErr = actionCreator("emitError");

// services
class CounterService extends Service<{ count: number }> {
  increase(): void {
    this.updateState((state) => ({ ...state, count: state.count + 1 }));
  }
  decrease(): void {
    this.updateState((state) => ({ ...state, count: state.count - 1 }));
  }
}

// controllers
class CounterController implements Controller {
  constructor(private counterService: CounterService) {}

  getHandler(): ActionHandler {
    return (action, { emitError, dispatch }) => {
      if (increase.match(action)) {
        return this.counterService.increase();
      }
      if (decrease.match(action)) {
        return this.counterService.decrease();
      }
      if (triggerDecrease.match(action)) {
        return dispatch(decrease());
      }
      if (throwError.match(action)) {
        throw new Error("test");
      }
      if (throwAsyncError.match(action)) {
        return this.throwAsync();
      }
      if (emitErr.match(action)) {
        return this.emitError(emitError);
      }
    };
  }

  async throwAsync(): Promise<void> {
    await wait(3);
    throw new Error("async test");
  }

  emitError(emitErr: ErrorEmitter): void {
    emitErr(new Error("test"));
  }
}

type ServiceRepo = {
  counter: CounterService;
};

function createStore(errorHandler?: Consumer<unknown>): Store<ServiceRepo> {
  const counter = new CounterService({ count: 0 });

  return new Store<ServiceRepo>({
    services: { counter },
    controllers: [new CounterController(counter)],
    errorHandler,
  });
}

function wait(time: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, time));
}
