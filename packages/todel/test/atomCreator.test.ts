import { isComputedMethod, isModifierMethod } from "../src";
import { createCounterAtom } from "./fixtures/atoms.fixtures";

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
