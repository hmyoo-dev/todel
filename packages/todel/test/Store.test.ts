import { ActionHandlerBuilder } from "../src/ActionHandlerBuilder";
import { Store } from "../src/Store";
import type { Consumer } from "../src/types/common.type";
import {
  decrease,
  emitErr,
  increase,
  throwAsyncError,
  throwError,
  triggerDecrease,
} from "./fixtures/actions.fixtures";
import { CounterAtom, createCounterAtom } from "./fixtures/atoms.fixtures";

describe("Store", () => {
  it("can be created by a provider", () => {
    const store = createStore({ initState: 10 });

    expect(store.atoms.counter.state).toEqual(10);
  });

  it("should update state when dispatch a action", () => {
    const store = createStore();
    const { counter } = store.atoms;

    expect(counter.state).toEqual(0);

    store.dispatch(increase());

    expect(counter.state).toEqual(1);
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

  it("should throw error if has error", () => {
    const store = createStore();
    expect(() => store.dispatch(throwError())).toThrowError("test");
  });

  it("should catch error in sync logic", async () => {
    const errorHandler = jest.fn();
    const store = createStore({ errorHandler });

    store.dispatch(throwError());

    checkErrorHandler(errorHandler, "test");
  });

  it("should catch error in async logic", async () => {
    const errorHandler = jest.fn();
    const store = createStore({ errorHandler });

    store.dispatch(throwAsyncError());

    await wait(10);

    checkErrorHandler(errorHandler, "async test");
  });

  it("should catch emitted error", () => {
    const errorHandler = jest.fn();
    const store = createStore({ errorHandler });

    store.dispatch(emitErr());

    checkErrorHandler(errorHandler, "test");
  });

  it("should serialize atoms", () => {
    const store = new Store({
      atoms: {
        counter: createCounterAtom({ initState: 1 }),
        sub: {
          counter: createCounterAtom(),
        },
        error: null,
      } as never,
      actionHandler: jest.fn(),
    });
    const result = store.toJson();

    expect(result).toEqual({ counter: 1, sub: { counter: 0 } });
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

type Atoms = {
  counter: CounterAtom;
};

const actionHandler = ActionHandlerBuilder.create<Atoms>()
  .addCase(increase.match, (_, { counter }) => {
    counter.modifiers.increase();
  })
  .addCase(decrease.match, (_, { counter }) => {
    counter.modifiers.decrease();
  })
  .addCase(triggerDecrease.match, (_, __, { dispatch }) => {
    dispatch(decrease());
  })
  .addCase(throwError.match, () => {
    throw new Error("test");
  })
  .addCase(throwAsyncError.match, () => throwAsync())
  .addCase(emitErr.match, (_, __, { emitError }) =>
    emitError(new Error("test"))
  )
  .build();

async function throwAsync(): Promise<void> {
  await wait(3);
  throw new Error("async test");
}

function createStore(
  option: {
    errorHandler?: Consumer<unknown>;
    initState?: number;
  } = {}
): Store<Atoms> {
  const { errorHandler, initState } = option;
  const counter = createCounterAtom({ initState });

  return new Store<Atoms>({
    atoms: { counter },
    actionHandler,
    errorHandler,
  });
}

function wait(time: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, time));
}
