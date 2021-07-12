import { AsyncStatus, isComputedMethod, isModifierMethod } from "../src";
import { createAjaxAtom, createCounterAtom } from "./fixtures/atoms.fixtures";

describe("atomCreator", () => {
  test("default init state", () => {
    const counter = createCounterAtom();
    expect(counter.state).toBe(0);
  });

  test("injected init state", () => {
    const counter = createCounterAtom({ initState: 10 });
    expect(counter.state).toBe(10);
  });

  test("deps", () => {
    const counter = createCounterAtom({ initState: 0, deps: { step: 10 } });
    counter.increase();
    expect(counter.state).toBe(10);
  });

  test("method kind", () => {
    const counter = createCounterAtom();
    expect(isComputedMethod(null)).toBe(false);
    expect(isComputedMethod(() => undefined)).toBe(false);
    expect(isComputedMethod(counter.isGreaterThen)).toBe(true);
    expect(isModifierMethod(counter.increase)).toBe(true);
  });

  test("computed", () => {
    const counter = createCounterAtom({ initState: 2 });

    expect(counter.isGreaterThen(1)).toBe(true);
    expect(counter.isGreaterThen(3)).toBe(false);
  });

  test("modifier", () => {
    const counter = createCounterAtom({ initState: 0 });
    counter.increase();
    expect(counter.state).toBe(1);

    counter.decrease();
    expect(counter.state).toBe(0);
  });

  test("async modifier", async () => {
    const counter = createCounterAtom({ initState: 0 });
    const num = await counter.fetch(Promise.resolve(10));

    expect(num).toEqual(10);
    expect(counter.state).toEqual(10);
  });

  test("subscribe", () => {
    const counter = createCounterAtom({ initState: 0 });
    const subscriber = jest.fn();

    counter.subscribe(subscriber);
    counter.increase();

    expect(subscriber).toHaveBeenCalledTimes(1);
    expect(subscriber).toHaveBeenCalledWith(counter, null);
  });

  test("toJson", () => {
    const counter = createCounterAtom({ initState: 1 });
    const { toJson } = counter;
    expect(toJson()).toBe(1);
  });
});

describe("atom.asyncSetState", () => {
  test("return resolved", async () => {
    const atom = createAjaxAtom();
    const res = await atom.fetchWithNoChange(Promise.resolve("test"));

    expect(res).toEqual("test");
  });

  test("throw rejected", (done) => {
    const atom = createAjaxAtom();
    atom.fetchWithNoChange(Promise.reject("err")).catch((err) => {
      expect(err).toEqual("err");
      done();
    });
  });

  test("success", async () => {
    const atom = createAjaxAtom();
    const res = atom.fetchWithAsyncSetter(Promise.resolve("test"));

    expect(atom.state.status).toEqual(AsyncStatus.Pending);
    const data = await res;
    expect(data).toEqual("test");

    expect(atom.state.status).toEqual(AsyncStatus.Success);
    expect(atom.state.data).toEqual("test");
  });

  test("failed", async () => {
    const atom = createAjaxAtom();
    const res = atom.fetchWithAsyncSetter(Promise.reject("err"));

    expect(atom.state.status).toEqual(AsyncStatus.Pending);
    await res.catch(() => "");

    expect(atom.state.status).toEqual(AsyncStatus.Failed);
    expect(atom.state.error).toEqual("err");
  });

  test("memo", async () => {
    const logs: string[] = [];

    const atom = createAjaxAtom({ deps: { prefix: "test" } });
    atom.subscribe((_, memo) => logs.push(memo));

    await atom.fetchWithAsyncSetter(Promise.resolve(""));
    await atom.fetchWithAsyncSetter(Promise.reject("")).catch(() => "");

    expect(logs).toEqual([
      "test/started",
      "test/done",
      "test/started",
      "test/failed",
    ]);
  });
});
