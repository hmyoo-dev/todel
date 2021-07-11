import { AnyStore, atomCreator, AtomMeta } from "todel";
import { createCounterAtom, increase } from "todel-test-helpers/fixtures";
import { mockMethod, mockStore } from "todel-test-helpers/helpers";
import { applyReduxDevtools } from "../src";
import {
  ReduxDevtools,
  ReduxDevtoolsConnector,
  ReduxDevtoolsOption,
} from "../src/types";

describe("applyReduxDevtools", () => {
  const devtoolsOption: ReduxDevtoolsOption = { name: "test" };
  const state = { counter: 1 };

  let devtools: ReduxDevtools;
  let connector: ReduxDevtoolsConnector;
  let store: AnyStore;

  beforeEach(() => {
    devtools = mockDevtools();
    connector = {
      connect: jest.fn().mockReturnValue(devtools),
    };
    window.__REDUX_DEVTOOLS_EXTENSION__ = connector;
    store = mockStore({});
    mockStoreJson();
  });

  it("should terminate if redux extension not installed", () => {
    window.__REDUX_DEVTOOLS_EXTENSION__ = undefined;

    applyDevtools();
  });

  it("should send state to init()", () => {
    mockStoreJson();
    applyDevtools();

    expect(devtools.init).toHaveBeenCalledWith(state);
  });

  it("should call send() when action dispatched", () => {
    const action = increase();
    mockStoreJson();
    applyDevtools();

    store.dispatch(action);

    expect(devtools.send).toHaveBeenCalledWith(action, state);
  });

  it("should call send() when atom is updated", () => {
    const atom = createCounterAtom();
    const repo = { test: atom };
    store = mockStore(repo);
    mockStoreJson();
    applyDevtools();
    atom.increase();

    expect(devtools.send).toHaveBeenCalledWith({ type: "> test" }, state);
  });

  it("should ignore send() if atom has ignore meta flag", () => {
    const atom = createIgnoredAtom();
    const repo = { test: atom };
    store = mockStore(repo);
    applyDevtools();
    atom.modifiers.setNum(10);

    expect(devtools.send).not.toHaveBeenCalled();
  });

  function mockStoreJson(): void {
    mockMethod(store, "toJson").mockReturnValue(state);
  }

  function applyDevtools(): void {
    applyReduxDevtools(store, devtoolsOption);
  }
});

function mockDevtools(): ReduxDevtools {
  return {
    init: jest.fn(),
    send: jest.fn(),
    error: jest.fn(),
    subscribe: jest.fn(),
    unsubscribe: jest.fn(),
  };
}

const createIgnoredAtom = atomCreator(({ setState }) => {
  const meta: AtomMeta = {
    devtool: { ignoreUpdate: true },
  };

  return {
    meta,
    initState: 0,
    modifiers: {
      setNum(num: number): void {
        setState(() => num);
      },
    },
  };
});
