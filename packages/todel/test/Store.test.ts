import { Store } from "../src/Store";
import { Service } from "../src/Service";
import { Controller } from "../src/Controller";
import { Action, Consumer, ErrorEmitter } from "../src/types";
import { actionCreator } from "../src/actionCreators";

describe("Store", () => {
  it("could be created by provider", () => {
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

    store.dispatch(emitError());

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
const throwError = actionCreator("throwError");
const throwAsyncError = actionCreator("throwAsyncError");
const emitError = actionCreator("emitError");

// services
class CounterService extends Service<{ count: number }> {
  increase(): void {
    this.updateState((state) => ({ ...state, count: state.count + 1 }));
  }
}

// controllers
class CounterController extends Controller {
  constructor(private counterService: CounterService) {
    super();
  }

  listener(action: Action, emitErr: ErrorEmitter): void | Promise<void> {
    if (increase.match(action)) {
      return this.increase();
    }
    if (throwError.match(action)) {
      return this.throwError();
    }
    if (throwAsyncError.match(action)) {
      return this.throwAsync();
    }
    if (emitError.match(action)) {
      return this.emitError(emitErr);
    }
  }

  increase(): void {
    this.counterService.increase();
  }

  throwError(): void {
    throw new Error("test");
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
